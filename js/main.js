function getRandomNumber(startNumber, finishNumber) {
    if (startNumber < 0 || finishNumber < 0) {
        throw new Error('Значения должны быть > 0');
    }
    if (startNumber > finishNumber) {
        [startNumber, finishNumber] = [finishNumber, startNumber];
    }
    return Math.floor(Math.random() * (finishNumber - startNumber + 1) + startNumber);
};


function checkMaxLength(text, maxLength) {
    return text.length <= maxLength;
};