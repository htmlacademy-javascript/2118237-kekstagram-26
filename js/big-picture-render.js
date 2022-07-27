const COMMENTS_COUNT_SHOW = 5;

const bigPicture = document.querySelector('.big-picture');
const socialComments = bigPicture.querySelector('. social__comments');
const socialCommentCountElement = bigPicture.querySelector('.social__comment-count');
const uploadCommentsElement = bigPicture.querySelector('.social__comments-loader');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');

const getCommentsAmount = (value) => {
    socialCommentCountElement.childNodes[0].textContent = `${value} из `;
};

const hideExtraComments = (comments) => {
    const extraComments = comments.slice(COMMENTS_COUNT_SHOW);
    extraComments.forEach((extraComment) => {
        extraComment.classList.add('hidden');
    });
};

const getMoreComments = (comments) => {
    const commentsAmount = comments.length;

    if (commentsAmount <= COMMENTS_COUNT_SHOW) {
        getCommentsAmount(commentsAmount);
        uploadCommentsElement.classList.add('hidden');
        return;
    }

    getCommentsAmount(COMMENTS_COUNT_SHOW);

    let shownCommentsAmount = COMMENTS_COUNT_SHOW;
    return function () {
        const availableAmount = commentsAmount - shownCommentsAmount;
        const newCommentsAmount = shownCommentsAmount + Math.min(COMMENTS_COUNT_SHOW, availableAmount);
        const commentsToShow = comments.slice(shownCommentsAmount, newCommentsAmount);
        commentsToShow.forEach((comment) => {
            comment.classList.remove('hidden');
        });

        if (availableAmount <= COMMENTS_COUNT_SHOW) {
            shownCommentsAmount += availableAmount;
            getCommentsAmount(shownCommentsAmount);
            uploadCommentsElement.classList.add('hidden');
            return;
        }

        shownCommentsAmount += COMMENTS_COUNT_SHOW;
        getCommentsAmount(shownCommentsAmount);
    };
};

const createComments = (comments) => {
    let commentsHtml = '';

    elements.forEach((comment) => {
        const tagLi = document.createElement('li');
        tagLi.classlist.add('social__comment');
        const tagImg = document.createElement('img');
        tagImg.classList.add('social__picture');
        tagImg.src = comment.avatar;
        tagImg.alt = comment.name;
        tagImg.width = 35;
        tagImg.height = 35;
        tagLi.appendChild(tagImg);
        const tagP = document.createElement('p');
        tagP.classList.add('social__text');
        tagP.textContent = comment.message;
        tagLi.appendChild(tagP);
        commentsHtml += tagLi;
    });
    socialComments.innerHTML = commentsHtml;
};

const closeBigPicture = () => {
    bigPicture.classlist.add('hidden');
    document.body.classList.remove('modal-open');
    cancelButton.removeEventListener('click', closeBigPicture);
    window.removeEventListener('keydown', handleKeyDown);
    uploadCommentsElement.onclick = null;
    uploadCommentsElement.classList.remove('hidden');
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
    createComments(post.comments);
    const allComments = Array.from(socialComments.querySelectorAll('li'));
    hideExtraComments(allComments);
    uploadCommentsElement.onclick = getMoreComments(allComments);
    cancelButton.addEventListener('click', closeBigPicture);
    window.addEventListener('keydown', handleKeyDown);

};

export { openBigPicture };