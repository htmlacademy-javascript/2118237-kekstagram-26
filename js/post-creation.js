import { checkIsEscPressed, checkStringMaxLength, showMessage } from './util.js';
import { sendData } from './api.js';

let activeMessage;
let currentEffect;
let currentEffectUnitMeasure;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG = /^(\s*#[A-Za-zА-ЯёЁа-я0-9]{1,19}\s*)((#[A-Za-zА-ЯёЁа-я0-9]{1,19}\b\s*){1,4})?$/;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;
const COMMENT_ERROR = `Комментарий не должен быть длиннее ${MAX_COMMENT_LENGTH} символов`;
const HASHTAG_ERROR = 'Поле имеет неверный формат';
const DUPLICATE_HASHTAG_ERROR = 'Хештеги не должны быть одинаковыми';
const successMessage = document.querySelector('#success').content.querySelector('.success');
const errorMessage = document.querySelector('#error').content.querySelector('.error');
const successButton = successMessage.querySelector('.success__button');
const errorButton = errorMessage.querySelector('.error__button');

const FilterType = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

const cssByFilter = {
  [FilterType.CHROME]: 'grayscale',
  [FilterType.SEPIA]: 'sepia',
  [FilterType.MARVIN]: 'invert',
  [FilterType.PHOBOS]: 'blur',
  [FilterType.HEAT]: 'brightness',
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
  window.removeEventListener('keydown', onKeydown, true);
  window.removeEventListener('click', onClick);
};

function onClick (evt) {
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

pristine.addValidator(textDescription, validateComment, COMMENT_ERROR);
pristine.addValidator(textHashtags, validateHashtag, HASHTAG_ERROR);
pristine.addValidator(textHashtags, validateDuplicateHashtag, DUPLICATE_HASHTAG_ERROR);

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

  if (scaleSmaller && scaleControlValue > MIN_SCALE) {
    scaleControlValue -= STEP_SCALE;
  }

  if (scaleBigger && scaleControlValue < MAX_SCALE){
    scaleControlValue += STEP_SCALE;
  }

  scaleControl.value = `${scaleControlValue}%`;
  uploadPreview.style.transform = `scale(${scaleControlValue / 100})`;
});

const getUpdateSlider = (min = 0, max  = 1, start = 1, step = 1) => ({
  range: { min: min, max: max },
  start: start,
  step: step,
  connect: 'lower',
});

const applyEffectToPost = (effectClass, effect, effectUnitMeasure) => {
  currentEffect = effect;
  currentEffectUnitMeasure = effectUnitMeasure;

  uploadPreview.classList.add(effectClass);
  uploadEffectLevel.classList.remove('hidden');
  uploadPreview.style.filter = `${effect}(${effectLevelValue.value}${effectUnitMeasure})`;
};

const deleteEffectFromPost = () => {
  currentEffect = '';
  currentEffectUnitMeasure = '';
  uploadPreview.classList.add('effects__preview--none');
  uploadEffectLevel.classList.add('hidden');
  uploadPreview.removeAttribute('style');
};

noUiSlider.create(effectLevelSlider, getUpdateSlider());

effectLevelSlider.noUiSlider.on('update', () => {
  const level = effectLevelSlider.noUiSlider.get();
  uploadPreview.style.filter = `${currentEffect}(${level}${currentEffectUnitMeasure})`;
});

const applySelectedEffect = (evt) => {
  uploadPreview.classList.value = null;

  switch (evt.target.value) {
    case FilterType.NONE:
      deleteEffectFromPost();
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider());
      break;
    case FilterType.CHROME:
      applyEffectToPost('effects__preview--chrome', cssByFilter.chrome,'');
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,1,1,0.1));
      break;
    case FilterType.SEPIA:
      applyEffectToPost('effects__preview--sepia', cssByFilter.sepia,'');
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,1,1,0.1));
      break;
    case FilterType.MARVIN:
      applyEffectToPost('effects__preview--marvin', cssByFilter.marvin,'%');
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,100,100,1));
      break;
    case FilterType.PHOBOS:
      applyEffectToPost('effects__preview--phobos', cssByFilter.phobos,'px');
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(0,3,3,0.1));
      break;
    case FilterType.HEAT:
      applyEffectToPost('effects__preview--heat', cssByFilter.heat,'');
      effectLevelSlider.noUiSlider.updateOptions(getUpdateSlider(1,3,3,0.1));
      break;
  }
};

const closePostCreation = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onKeydown);

  uploadForm.reset();
  pristine.reset();

  uploadCancel.removeEventListener('click', closePostCreation);
  effectsList.removeEventListener('change', applySelectedEffect);
  uploadOverlay.removeEventListener('submit', onUploadFormSubmit);
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
  window.addEventListener('keydown', onKeydown);
  uploadForm.addEventListener('submit', onUploadFormSubmit);

  const fileReader = new FileReader();
  fileReader.onload = (evt) => {
    uploadPreview.src = evt.target.result;
  };

  fileReader.readAsDataURL(file);
};

function onKeydown(evt) {
  if (checkIsEscPressed(evt)) {
    if (evt.target.matches('input') && evt.target.type === 'text' || evt.target.matches('textarea')) {
      return;
    }
    if (evt.target.lastChild.className === 'error') {
      errorMessage.remove();
      return;
    }
    if (evt.target.lastChild.className === 'success') {
      successMessage.remove();
      return;
    }
    closePostCreation();
  }
}

const showSuccessMessage = () => {
  activeMessage = successMessage;
  document.body.appendChild(successMessage);

  successButton.addEventListener('click', closeMessage, { once: true });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('click', onClick);
};

const showErrorMessage = () => {
  activeMessage = errorMessage;
  document.body.appendChild(errorMessage);
  errorMessage.style.zIndex = '2';
  errorButton.addEventListener('click', closeMessage, { once:true });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('click', onClick);
};

function onUploadFormSubmit(evt) {
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
