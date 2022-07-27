import { checkIsEscPressed, checkStringMaxLength } from './util.js';

const MAX_COMMENT_LENGTH = 140;
const HASHTAG = /(^#[A-Za-zА-Яа-яЁё0-9]{1,19}\b\s?)((\b\s#[A-Za-zА-Яа-яЁё0-9]{1,19}\b\s?){1,4})?$/;

const commentError = `Комментарий не должен быть длиннее ${MAX_COMMENT_LENGTH} символов`;
const hashtagError = 'Поле имеет неверный формат';
const duplicateHashtagError = 'Хештеги не должны быть одинаковыми';

const uploadFormElement = document.querySelector('.img-upload__form');
const editFormElement = uploadFormElement.querySelector('.img-upload__overlay');
const closeFormButtonElement = uploadFormElement.querySelector('.img-upload__cancel');
const postHashtagElement = uploadFormElement.querySelector('.text__hashtags');
const postDescriptionElement = uploadFormElement.querySelector('.text__description');
const uploadPreviewElement = uploadFormElement.querySelector('.img-upload__preview').querySelector('img');
const uploadSubmitElement = uploadFormElement.querySelector('.img-upload__submit');
const fileUploadElement = uploadFormElement.querySelector('#upload-file');

const pristine = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'text-error'
});

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

pristine.addValidator(postDescriptionElement, validateComment, commentError);
pristine.addValidator(postHashtagElement, validateHashtag, hashtagError);
pristine.addValidator(postHashtagElement, validateDuplicateHashtag, duplicateHashtagError);

uploadFormElement.addEventListener('submit', (evt) => {
    const valid = pristine.validate();
    if (!valid) {
        evt.preventDefault();
    }
});


const closePostCreation = () => {
    editFormElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', escapeKeydown);

    uploadFormElement.reset();
    pristine.reset();

    closeFormButtonElement.removeEventListener('click', closePostCreation);
    editFormElement.removeEventListener('submit', postSubmitting);
};

const createNewPost = () => {
    const file = fileUploadElement.files[0];
    if (!file.type.startsWith('image/')) {
        showMessage('Не удалось загрузить изображение');
        return;
    }

    editFormElement.classList.remove('hidden');
    document.body.classList.add('modal-open');

    closeFormButtonElement.addEventListener('click', closePostCreation);
    window.addEventListener('keydown', escapeKeydown);
    uploadFormElement.addEventListener('submit', postSubmitting);

    const fileReader = new FileReader();
    fileReader.onload = (evt) => {
        uploadPreviewElement.src = evt.target.result;
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

function postSubmitting(evt) {
    evt.preventDefault();

    if (pristine.validate()) {
        uploadSubmitElement.disabled = true;
        sendData(
            () => {
                closePostCreation();
                showSuccessMessage();
                uploadSubmitElement.disabled = false;
            },
            () => {
                showErrorMessage();
                uploadSubmitElement.disabled = false;
            },

            new FormData(evt.target)
        );
    }
}

fileUploadElement.addEventListener('change', createNewPost);
