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

function checkStringMaxLength(text, maxLength) {
    return text.length <= maxLength;
};

function getSeveralElementsFromArray(array, quantity) {
    const RANDOM_ELEMENTS = [];

    quantity.forEach((element) => {
        RANDOM_ELEMENTS.push(getRandomElementFromArray(array));
    });

    return RANDOM_ELEMENTS;
};

const ESC_KEYCODE = 27;
const checkIsEscPressed = (evt) => evt.keyCode === ESC_KEYCODE;

export { checkIsEscPressed, getRandomNumber, checkStringMaxLength, getRandomElementFromArray, getSeveralElementsFromArray };