// const { response } = require("express");

const createWormhole = document.getElementById("createWormhole");
const wellcome = document.getElementById("wellcome");
const message = document.getElementById("message");
const createMessage = document.getElementById("createMessage");
const sessionsName = document.getElementById("sessionsName");
const sessionsClient = document.getElementById("sessionsClient");
const getMessage = document.getElementById("getMessage");
const userId = document.getElementById("user_id");
const tapeOfdialog = document.getElementById("tapeOfdialog");

// Get tape of conversation

const correspondence = async (user_id) => {
    tapeOfdialog.innerHTML = "";
    const response = await fetch(`/api/conversations/${user_id}`);
    const result = await response.json();
    console.log(result);

    result.map(el => {
        const p = document.createElement("p");
        p.innerHTML = `Client: ${el.client}. ${el.content} <br>${el.createdAt}`;
        tapeOfdialog.append(p);
    });
}

// Создание нового юзера с рандомным именем
createWormhole.addEventListener("click", async (event) => {    
    const name = getRandomInt(0, alfabeth.length);

    sessionsName.innerText = name;
    sessionsClient.innerText = 1;
    
    console.log(name);

    await fetch ('/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const response = await fetch (`/api/users/${name}`);
    const user = await response.json();

    userId.innerText = user.id;
    
    createWormhole.style.display = "none";
    createMessage.style.display = "flex";
});

// Send of message from Client
createMessage.addEventListener("submit", async (event) => {
    event.preventDefault();    
    
    const client = +sessionsClient.innerText;
    const user_id = +userId.innerText;
    const content = message.value;

    if (message.value !== "") {
        await fetch ('/api/conversations', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, content, client }),
        });        
    }

    correspondence(user_id);
    message.value = "";
})

getMessage.addEventListener("click", (event) => {

    const user_id = +userId.innerText;
    correspondence(user_id);
});
