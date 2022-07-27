const ALERT_SHOW_TIME = 5000;

function getRandomNumber(startNumber, finishNumber) {
  if (startNumber < 0 || finishNumber < 0) {
    throw new Error('Значения должны быть > 0');
  }
  if (startNumber > finishNumber) {
    [startNumber, finishNumber] = [finishNumber, startNumber];
  }
  return Math.floor(Math.random() * (finishNumber - startNumber + 1) + startNumber);
}

function getRandomElementFromArray(array) {
  return array[getRandomNumber(0, array.length - 1)];
}

function checkStringMaxLength(text, maxLength) {
  return text.length <= maxLength;
}

function getSeveralElementsFromArray(array, quantity) {
  const RANDOM_ELEMENTS = [];
  for (let i = 0; i < quantity; i++) {
    RANDOM_ELEMENTS.push(getRandomElementFromArray(array));
  }

  return RANDOM_ELEMENTS;
}
export const showMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');

  div.textContent = message;
  document.body.appendChild(div);

  setTimeout(() => { div.remove(); }, ALERT_SHOW_TIME);
};

const ESC_KEYCODE = 27;
const checkIsEscPressed = (evt) => evt.keyCode === ESC_KEYCODE;

export const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export { checkIsEscPressed, getRandomNumber, checkStringMaxLength, getRandomElementFromArray, getSeveralElementsFromArray };
