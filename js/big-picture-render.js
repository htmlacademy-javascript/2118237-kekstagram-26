import { checkIsEscPressed } from './util.js';

const COMMENTS_COUNT_SHOW = 5;

const bigPicture = document.querySelector('.big-picture');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const socialCommentsLoader = bigPicture.querySelector('.social__comments-loader');
const bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

const getAllCommentsCount = (value) => {
  socialCommentCount.childNodes[0].textContent = `${value} из `;
};

const hideMoreComments = (comments) => {
  const moreComments = comments.slice(COMMENTS_COUNT_SHOW);
  moreComments.forEach((otherComment) => {
    otherComment.classList.add('hidden');
  });
};

const getMoreComments = (comments) => {
  const allCommentsCount = comments.length;

  if (allCommentsCount <= COMMENTS_COUNT_SHOW) {
    getAllCommentsCount(allCommentsCount);
    socialCommentsLoader.classList.add('hidden');
    return;
  }

  getAllCommentsCount(COMMENTS_COUNT_SHOW);

  let shownAllCommentsCount = COMMENTS_COUNT_SHOW;
  return function () {
    const availableAmount = allCommentsCount - shownAllCommentsCount;
    const newAllCommentsCount = shownAllCommentsCount + Math.min(COMMENTS_COUNT_SHOW, availableAmount);
    const commentsToShow = comments.slice(shownAllCommentsCount, newAllCommentsCount);
    commentsToShow.forEach((comment) => {
      comment.classList.remove('hidden');
    });

    if (availableAmount <= COMMENTS_COUNT_SHOW) {
      shownAllCommentsCount += availableAmount;
      getAllCommentsCount(shownAllCommentsCount);
      socialCommentsLoader.classList.add('hidden');
      return;
    }

    shownAllCommentsCount += COMMENTS_COUNT_SHOW;
    getAllCommentsCount(shownAllCommentsCount);
  };
};

const createComments = (comments) => {
  const commentFragment = document.createDocumentFragment();

  comments.forEach(({ avatar, name, message }) => {

    const list = '<li class="social__comment"><img class="social__picture"><p class="social__text"></p></li>';
    socialComments.innerHTML = list;

    const socialComment = bigPicture.querySelector('.social__comment');
    socialComment.querySelector('.social__picture').src = avatar;
    socialComment.querySelector('.social__picture').alt = name;
    socialComment.querySelector('.social__text').textContent = message;

    commentFragment.append(socialComment);
  });
  socialComments.append(commentFragment);
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  bigPictureCancel.removeEventListener('click', closeBigPicture);
  window.removeEventListener('keydown', onKeyDown);
  socialCommentsLoader.onclick = null;
  socialCommentsLoader.classList.remove('hidden');
};

function onKeyDown(evt) {
  if (checkIsEscPressed(evt)) {
    closeBigPicture();
  }
}

export const openBigPicture = (post) => {
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = post.url;
  bigPicture.querySelector('.likes-count').textContent = post.likes;
  bigPicture.querySelector('.comments-count').textContent = post.comments.length;
  bigPicture.querySelector('.social__caption').textContent = post.description;
  createComments(post.comments);
  const allComments = Array.from(socialComments.querySelectorAll('li'));
  hideMoreComments(allComments);
  socialCommentsLoader.onclick = getMoreComments(allComments);
  bigPictureCancel.addEventListener('click', closeBigPicture);
  window.addEventListener('keydown', onKeyDown);
};
