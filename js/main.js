import { bindPostClickListener, renderPosts } from './render-posts.js';
import { getData } from './api.js';
import { openBigPicture } from './big-picture-render.js';
import './post-creation.js';

getData((posts) => {
  renderPosts(posts);
  bindPostClickListener((postId) => {
    const post = posts.find((post) => post.id == postId);
    openBigPicture(post);
  });
});


