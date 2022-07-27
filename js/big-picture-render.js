const bigPicture = document.querySelector('.big-picture');
const socialComments = bigPicture.querySelector('. social__comments');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');

const createComments = (elements) => {
    comments = '';

    elements.forEach((element) => {
        const tagLi = document.createElement('li');
        tagLi.classlist.add('social__comment');
        const tagImg = document.createElement('img');
        tagImg.classList.add('social__picture');
        tagImg.src = element.avatar;
        tagImg.alt = element.name;
        tagImg.width = 35;
        tagImg.height = 35;
        tagLi.appendChild(tagImg);
        const tagP = document.createElement('p');
        tagP.classList.add('social__text');
        tagP.textContent = element.message;
        tagLi.appendChild(tagP);
        comments += tagLi;
    });
    socialComments.innerHTML = comments;
};

const closeBigPicture = () => {
    bigPicture.classlist.add('hidden');
    document.body.classList.remove('modal-open');
    cancelButton.removeEventListener('click', closeBigPicture);
    window.removeEventListener('keydown', handleKeyDown);
};

function handleKeyDown(evt) {
    if (checkIsEscPressed(evt)) {
        closeBigPicture();
    }
}

const openBigPicture = (post) => {
    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
    bigPicture.querySelector('.big-pictureimg').querySelector('img').src = post.urI;
    bigPicture.quervSelector('.likes-count').textContent = post.likes;
    bigPicture.querySelector('.comments-count').textContent = post.comments.length;
    bigPicture.querySelector('.social caption').textContent = post.description;
    bigPicture.querySelector('.socialcomment-count').classList.add('hidden');
    bigPicture.querySelector('.comments-loader').classList.add('hidden');
    createComments(post.comments);
    cancelButton.addEventListener('click', closeBigPicture);
    window.addEventListener('keydown', handleKeyDown);

};

export { openBigPicture };