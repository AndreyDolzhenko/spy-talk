const createWormhole = document.getElementById("createWormhole");

createWormhole.addEventListener("click", async (event) => {

    console.log(getRandomInt(0, alfabeth.length));

    const name = getRandomInt(0, alfabeth.length);

    await fetch ('/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

});