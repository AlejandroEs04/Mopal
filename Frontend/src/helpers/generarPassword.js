function generatePSWD() {
    let randPSWD = "";
    let lenOfPSWD = 12;
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

    for (let i = 0; i < lenOfPSWD; i++) {
        let randChar = Math.floor(Math.random() * characters.length);
        randPSWD += characters.substring(randChar, randChar + 1);
    }
    return randPSWD;
}

export default generatePSWD;