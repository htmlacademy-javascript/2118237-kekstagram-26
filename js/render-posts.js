const pictureBox = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

export const renderPosts = (postsData) => {
  const picturesFragment = document.createDocumentFragment();

  postsData.forEach((post) => {
    const samePicture = pictureTemplate.cloneNode(true);
    samePicture.querySelector('.picture__img').src = post.url;
    samePicture.querySelector('.picture__comments').textContent = post.comments.length;
    samePicture.querySelector('.picture__likes').textContent = post.likes;
    samePicture.dataset.pictureId = post.id;
    picturesFragment.appendChild(samePicture);
  });

  pictureBox.appendChild(picturesFragment);
};

export const bindPostClickListener = (callback) => {
  pictureBox.addEventListener('click', (evt) => {
    const samePicture = evt.target.closest(".picture");
    if (samePicture) {
      callback(samePicture.dataset.pictureId);
    }
  })
};
