const app = document.querySelector('.app'),
    mode = document.querySelector('#mode'),

    chats = document.querySelector('.chats'),
    add_chat = document.querySelector('#add-chat'),

    clear = document.querySelector('#delete'),

    qna = document.querySelector('.qna'),

    input = document.querySelector('.request input'),
    send = document.querySelector('#send');

    OPENAI_API_KEY = "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",
    url = "https://api.openai.com/v1/chat/completions";


    mode.addEventListener('click', toggleMode);
    add_chat.addEventListener('click', addNewChat);
    send.addEventListener('click', getAnswer);
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            getAnswer();
        }
    });
    

    clear.addEventListener('click', () => chats.innerHTML = '');

//update  light mode & dark mode
function toggleMode()
{
    console.log('sclicked'); 
    const light_mode = app.classList.contains('light');
    app.classList.toggle('light', !light_mode)

    mode.innerHTML = `<i class="fa-regular fa-${light_mode ? 'sun' : 'moon'}" class="icon"></i> ${light_mode ? 'light mode' : 'dark mode'}`
}

//create tab for new chat 

function addNewChat()
{
    chats.innerHTML += `
    <li>
        <div>
            <i class="fa-regular fa-comment-dots" class="icon"></i>
            <span class="chat-title" contenteditable>New chat</span>
        </div>
        <div>
            <i class="fa-solid fa-trash-can" class="icon" onclick="removeChat(this)"></i>
            <i class="fa-solid fa-pen" class="icon" onclick="updateChatTitle(this)"></i>
        </div>
    </li>`;
}

const removeChat = (el) => el.parentElement.parentElement.remove();
const updateChatTitle = (el) => el.parentElement.previousElementSibling.lastElementChild.focus() ;
//displaying user questions & bot answer

async function getAnswer() {
    const options = {
        method : 'POST',
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${OPENAI_API_KEY}`
        },
        body : JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: input.value}],
            temperature: 0
        })
    }
    try {
        if(input.value.length >= 3){
            const id = generateId()
            const question = input.value;
            app.querySelector('.hints p').innerHTML = question;
            //const hints = document.querySelector('.hints');
            // hints.querySelector('p').innerHTML = question;
        
            qna.innerHTML += createChat(question, id);
            qna.scrollTop = qna.scrollHeight;

            input.setAttribute('readonly', true);
            send.setAttribute('disabled', true);

            const p = document.getElementById(id);
            const res = await fetch(url, options);
            if(res.ok){
                p.innerHTML = "";
                input.value = "";

                input.removeAttribute('readonly');
                send.removeAttribute('disabled');
                
                const data = await res.json();
                console.log(data);
                const msg = data.choices[0].message.content;
                typeWriter(p, msg);
            }
        }         
    }
    catch (err) {
        console.error(err);
    }
}

function createChat(question, id){
    return (
        `<div class="result">
        <div class="question">
            <i class="fa-solid fa-user-gear" style="color: #335af5;" class="icon blue"></i>
            <h3>${question}</h3>
        </div>
        <div class="answer">
            <i class="fa-solid fa-robot " style="color: #00ada1;" class="icon green"></i>
            <p id="${id}"><iconify-icon icon="svg-spinners:3-dots-scale" class="loading"></iconify-icon></p>
        </div>
    </div>`
    );
}


//generate unique ID

function generateId(){
    const id = Math.random.toString(16) + Date.now();
    return id.substring(2, id.length - 2);
}



//openAI api key and necessary option




//typewriter effects

function typeWriter(el, ans){
    let i=0,
        interval = setInterval(() => {
            qna.scrollTop = qna.scrollHeight;
            if(i < ans.length) {
                el.innerHTML += ans.charAt(i);
                i++;
            }else{
                clearInterval(interval)
            }
        }, 13);
}