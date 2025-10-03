const numbers = [];
const alfabeth = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    let result = "";

    for (let index = 0; index < 3; index++) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        const element = num + alfabeth[num];
        result += element;
    }    

    return result;
}
