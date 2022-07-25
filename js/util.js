function getRandomNumber(startNumber, finishNumber) {
    if (startNumber < 0 || finishNumber < 0) {
        throw new Error('Значения должны быть > 0');
    }
    if (startNumber > finishNumber) {
        [startNumber, finishNumber] = [finishNumber, startNumber];
    }
    return Math.floor(Math.random() * (finishNumber - startNumber + 1) + startNumber);
};

function getRandomElementFromArray(array) {
    array[getRandomNumber(0, array.length - 1)];
};

function checkCommentsMaxLength(text, maxLength) {
    return text.length <= maxLength;
};



function getSeveralElementsFromArray(array, quantity) {
    const RANDOM_ELEMENTS = [];
    for (let i = 0; i < quantity; i++) {
        RANDOM_ELEMENTS[i] = getRandomElementFromArray(array);
    }
    return RANDOM_ELEMENTS;
};

export { getRandomNumber, checkCommentsMaxLength, getRandomElementFromArray, getSeveralElementsFromArray };