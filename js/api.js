import { showMessage } from './util.js';

const getDataError = 'Ошибка получения данных';

export const getData = (onSuccess) => {
  fetch('https://26.javascript.pages.academy/kekstagram/data')
    .then((response) => response.json())
    .then((posts) => onSuccess(posts))
    .catch(() => showMessage(getDataError));
};

export const sendData = (onSuccess, onFail, body) => {
  fetch('https://26.javascript.pages.academy/kekstagram',{method:'POST', body})
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => onFail());
};
