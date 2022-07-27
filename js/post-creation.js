import { checkIsEscPressed, checkStringMaxLength, showMessage } from './util.js';
import { sendData } from './api.js';

let activeMessage;
let currentEffect;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG = /(^#[A-Za-zА-Яа-яЁё0-9]{1,19}\b\s?)((\b\s#[A-Za-zА-Яа-яЁё0-9]{1,19}\b\s?){1,4})?$/;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;
const commentError = `Комментарий не должен быть длиннее ${MAX_COMMENT_LENGTH} символов`;
const hashtagError = 'Поле имеет неверный формат';
const duplicateHashtagError = 'Хештеги не должны быть одинаковыми';
const successMessage = document.querySelector('#success').content.querySelector('.success');
const errorMessage = document.querySelector('#error').content.querySelector('.error');
const successButton = successMessage.querySelector('.success__button');
const errorButton = errorMessage.querySelector('.error__button');

const FILTER_TYPE = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

const FILTER_CSS_VALUE = {
  [FILTER_TYPE.CHROME]: 'grayscale',
  [FILTER_TYPE.SEPIA]: 'sepia',
  [FILTER_TYPE.MARVIN]: 'invert',
  [FILTER_TYPE.PHOBOS]: 'blur',
  [FILTER_TYPE.HEAT]: 'brightness',
};

const uploadForm = document.querySelector('.img-upload__form');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('.img-upload__cancel');
const uploadSubmit = uploadForm.querySelector('.img-upload__submit');
const textHashtags = uploadForm.querySelector('.text__hashtags');
const textDescription = uploadForm.querySelector('.text__description');
const uploadScale = uploadForm.querySelector('.img-upload__scale');
const uploadPreview = uploadForm.querySelector('.img-upload__preview').querySelector('img');
const uploadEffectLevel = uploadForm.querySelector('.img-upload__effect-level');
const scaleControl = uploadForm.querySelector('.scale__control--value');
const effectsList = uploadForm.querySelector('.effects__list');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const uploadFile = uploadForm.querySelector('#upload-file');

const pristine = new Pristine(uploadForm,
  {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'text-error'
  });

const closeMessage = () => {
  document.body.removeChild(activeMessage);
  window.removeEventListener('keydown', escapeKeydown, true);
  window.removeEventListener('click', onClickMessageForm);
};

function onClickMessageForm (evt) {
  if (evt.target === activeMessage){
    closeMessage();
  }
}

const validateComment = (value) => checkStringMaxLength(value, MAX_COMMENT_LENGTH);
const validateHashtag = (value) => {
  if (!value) {
    return true;
  }
  return HASHTAG.test(value);
};
const validateDuplicateHashtag = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.replace(/ +/, ' ').trim().toLowerCase().split(' ');
  return hashtags.length === new Set(hashtags).size;
};

pristine.addValidator(textDescription, validateComment, commentError);
pristine.addValidator(textHashtags, validateHashtag, hashtagError);
pristine.addValidator(textHashtags, validateDuplicateHashtag, duplicateHashtagError);

uploadForm.addEventListener('submit', (evt) => {
  const valid = pristine.validate();
  if (!valid) {
    evt.preventDefault();
  }
});

uploadScale.addEventListener('click',(evt) => {
  const scaleSmaller = evt.target.closest('.scale__control--smaller');
  const scaleBigger = evt.target.closest('.scale__control--bigger');

  let scaleControlValue = +(scaleControl.value).replace('%','');

  if(scaleSmaller && scaleControlValue > MIN_SCALE){
    scaleControlValue -= STEP_SCALE;
    uploadPreview.style.transform = `scale(${(scaleControlValue)/100})`;
    scaleControl.value = `${scaleControlValue}%`;
  }

  if(scaleBigger && scaleControlValue < MAX_SCALE){
    scaleControlValue += STEP_SCALE;
    uploadPreview.style.transform = `scale(${(scaleControlValue)/100})`;
    scaleControl.value = `${scaleControlValue}%`;
  }
});

const getUpdateSlider = (min = 0, max  = 1, start = 1, step = 1, unit= '') => ({
  range: { min: min, max: max },
  start: start,
  step: step,
  connect: 'lower',
  format: {
    to: (value) => {
      if(Number.isInteger(value)) {
        return `${value.toFixed(0)}${unit}`;
      }
    },
    from: (value) => parseFloat(value.replace(unit, '')),
  }
});

const applyEffectToPost = (effectClass, effect) => {
  currentEffect = effect;

  uploadPreview.classList.add(effectClass);
  uploadEffectLevel.classList.remove('hidden');
  uploadPreview.style.filter = `${effect}(${effectLevelValue.value})`;
};

const deleteEffectFromPost = () => {
  uploadPreview.classList.add('effects__preview--none');
  uploadEffectLevel.classList.add('hidden');
  uploadPreview.removeAttribute('style');
};

noUiSlider.create(effectLevelSlider, getUpdateSlider());

effectLevelSlider.noUiSlider.on('update', () => {
  const level = effectLevelSlider.noUiSlider.get();
  uploadPreview.style.filter = `${currentEffect}(${level})`;
});

const applySelectedEffect = (evt) => {
  uploadPreview.classList.value = null;

  switch (evt.target.value) {
    case FILTER_TYPE.NONE:
      deleteEffectFromPost();
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider());
      break;
    case FILTER_TYPE.CHROME:
      applyEffectToPost('effects__preview--chrome', FILTER_CSS_VALUE.chrome);
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,1,1,0.1));
      break;
    case FILTER_TYPE.SEPIA:
      applyEffectToPost('effects__preview--sepia', FILTER_CSS_VALUE.sepia);
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,1,1,0.1));
      break;
    case FILTER_TYPE.MARVIN:
      applyEffectToPost('effects__preview--marvin', FILTER_CSS_VALUE.marvin);
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,100,100,1,'%'));
      break;
    case FILTER_TYPE.PHOBOS:
      applyEffectToPost('effects__preview--phobos', FILTER_CSS_VALUE.phobos);
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,3,3,0.1,'px'));
      break;
    case FILTER_TYPE.HEAT:
      applyEffectToPost('effects__preview--heat', FILTER_CSS_VALUE.heat);
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(1,3,3,0.1));
      break;
  }
};

const closePostCreation = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', escapeKeydown);

  uploadForm.reset();
  pristine.reset();

  uploadCancel.removeEventListener('click', closePostCreation);
  effectsList.removeEventListener('change', applySelectedEffect);
  uploadOverlay.removeEventListener('submit', postSubmitting);
  uploadPreview.removeAttribute('style');

  effectLevelSlider.noUiSlider.reset();
  uploadPreview.classList.value = null;
  currentEffect = null;
};

export const createNewPost = () => {
  const file = uploadFile.files[0];
  if (!file.type.startsWith('image/')) {
    showMessage('Не удалось загрузить изображение');
    return;
  }

  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  effectsList.addEventListener('change', applySelectedEffect);
  uploadEffectLevel.classList.add('hidden');

  uploadCancel.addEventListener('click', closePostCreation);
  window.addEventListener('keydown', escapeKeydown);
  uploadForm.addEventListener('submit', postSubmitting);

  const fileReader = new FileReader();
  fileReader.onload = (evt) => {
    uploadPreview.src = evt.target.result;
  };

  fileReader.readAsDataURL(file);
};

function escapeKeydown(evt) {
  if (checkIsEscPressed(evt)) {
    if (evt.target.matches('input') && evt.target.type === 'text' || evt.target.matches('textarea')) {
      return;
    }
    closePostCreation();
  }
}

const showSuccessMessage = () => {
  activeMessage = successMessage;
  document.body.appendChild(successMessage);

  successButton.addEventListener('click', closeMessage, { once: true });
  window.addEventListener('keydown', escapeKeydown);
  window.addEventListener('click', onClickMessageForm);
};

const showErrorMessage = () => {
  activeMessage = errorMessage;
  document.body.appendChild(errorMessage);

  errorButton.addEventListener('click', closeMessage, { once:true });
  window.addEventListener('keydown', escapeKeydown);
  window.addEventListener('click', onClickMessageForm);
};

function postSubmitting(evt) {
  evt.preventDefault();

  if (pristine.validate()) {
    uploadSubmit.disabled = true;
    sendData(
      () => {
        closePostCreation();
        showSuccessMessage();
        uploadSubmit.disabled = false;
      },
      () => {
        showErrorMessage();
        uploadSubmit.disabled = false;
      },

      new FormData(evt.target)
    );
  }
}

uploadFile.addEventListener('change', createNewPost);
