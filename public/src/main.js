const createWormhole = document.getElementById("createWormhole");
const wellcome = document.getElementById("wellcome");
const message = document.getElementById("message");
const createMessage = document.getElementById("createMessage");
const sessionsName = document.getElementById("sessionsName");
const sessionsClient = document.getElementById("sessionsClient");
const getMessage = document.getElementById("getMessage");
const userId = document.getElementById("user_id");
const tapeOfdialog = document.getElementById("tapeOfdialog");
const enterCode = document.getElementById("enterCode");
const deleteChat = document.getElementById("deleteChat");
const checkChannel = document.getElementById("checkChannel");
const deleteChannel = document.getElementById("deleteChannel");
const changeColor = document.getElementById("changeColor");

const webSocketService = new WebSocketService();

// console.log(webSocketService.connect);

// changeColor create

const changeColorCreate = () => {
  changeColor.innerHTML = "";
  colors.map((el, index) => {
    const li = document.createElement("li");
    li.style = `background: ${el}; width: 2em; height: 1em; border-radius: 0.5em; margin-right: 0.5em; list-style-type: none; display: block;`;
    li.id = index;
    li.addEventListener("click", (event) => {
      sessionsClient.innerText = event.target.id;
    });
    changeColor.append(li);
  });
};

// Get tape of conversation

const correspondence = async (user_id) => {
  tapeOfdialog.innerHTML = "";
  const response = await fetch(`/api/conversations/${user_id}`);
  const result = await response.json();

  result.map((el) => {
    const p = document.createElement("p");
    p.style.marginBottom = "5px";
    // el.client == 1 ? (p.style.color = "blue") : (p.style.color = "green");
    p.style.color = colors[el.client];

    let str = el.createdAt.slice(0, -5);
    let result = str.substring(0, 10) + " " + str.substring(11);
    p.innerHTML = `Client: ${el.client}. ${el.content} <br>${result}`;
    tapeOfdialog.append(p);
  });
};

// checkChannel

checkChannel.addEventListener("click", (event) => {
  if (event.target.checked == true) {
    checkChannel.style.background = "red";
    document.getElementById("deleteChannel").disabled = false;
  } else {
    checkChannel.style.background = "bisque";
    document.getElementById("deleteChannel").disabled = true;
  }
});

// Delete Chat

const deleteChatFunc = async (user_id) => {
  const response = await fetch(`/api/conversations/${user_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    console.log("Delete chat!");
  } else {
    const error = await response.json();
    alert(`Ошибка: ${error.message}`);
  }
  tapeOfdialog.innerHTML = "";
  const p = document.createElement("p");
  p.style.color = "red";
  p.textContent = "Все чаты данного пользователя удалены!";
  tapeOfdialog.append(p);
};

deleteChat.addEventListener("click", (event) => {
  const user_id = +userId.innerText;
  deleteChatFunc(user_id);
});

// delete Channel

const deleteChannelFunc = async (user_id) => {
  const response = await fetch(`/api/conversations/${user_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const id = user_id;

  await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    console.log("Delete chat!");
  } else {
    const error = await response.json();
    alert(`Ошибка: ${error.message}`);
  }

  tapeOfdialog.innerHTML = "";
  const p = document.createElement("p");
  p.style.color = "red";
  p.textContent = "Данный пользователь и все его чаты удалены!";
  tapeOfdialog.append(p);
};

deleteChannel.addEventListener("click", (event) => {
  const user_id = +userId.innerText;

  checkChannel.checked = false; // Убираем .event.target
  checkChannel.style.background = "bisque";
  deleteChannel.disabled = true; // Используем переменную напрямую

  deleteChannelFunc(user_id);
});

// Подключение к имеющемуся юзеру и начало беседы

enterCode.addEventListener("submit", async (event) => {
  event.preventDefault();

  sessionsName.innerText = enterCode[0].value;

  const name = enterCode[0].value;

  // console.log("enterCode[0].value - ", enterCode[0].value);
  // console.log("name - ", name);

  const response = await fetch(`/api/users/${name}`);
  const user = await response.json();

  userId.innerText = user.id;

  webSocketService.connect(user.id);

  createWormhole.style.display = "none";
  createMessage.style.display = "flex";

  changeColorCreate();
});

// Создание нового юзера с рандомным именем
const createNewChanel = async (name) => { 

  try {    
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();

    // Выводим сообщение в консоль браузера
    if (response.ok) {
      sessionsName.innerText = name;
      sessionsClient.innerText = 1;      

      const responseID = await fetch(`/api/users/${name}`);
      const user = await responseID.json();

      userId.innerText = user.id;
      userId.innerText = user.id;

      createWormhole.style.display = "none";
      createMessage.style.display = "flex";
      console.log("✅ Пользователь успешно создан:");
    } else {
      console.log("❌ Ошибка:", result.message);

      // Для конфликта (409) выводим специальное сообщение
      if (response.status === 409) {
        console.warn("⚠️ Конфликт:", result.message);
        createNewChanel(name + getRandomInt(0, alfabeth.length - 1));
        // alert(
        //   "Пользователь с таким именем уже существует! Нажмите 'create wormhole' ещё раз! "
        // );
      }
    }

    return result;
  } catch (error) {
    console.error("🔥 Сетевая ошибка:", error.message);
    throw error;
  }
};

createWormhole.addEventListener("click", (event) => {
  const name = getRandomInt(0, alfabeth.length - 1);
  // const name = "1B7H";

  createNewChanel(name);

});

//

// Send of message from Client

createMessage.addEventListener("submit", async (event) => {
  event.preventDefault();

  const client = +sessionsClient.innerText;
  const user_id = +userId.innerText;
  const content = message.value;

  if (message.value !== "") {
    await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, content, client }),
    });
  }

  correspondence(user_id);
  message.value = "";
});

getMessage.addEventListener("click", (event) => {
  const user_id = +userId.innerText;
  correspondence(user_id);
});
