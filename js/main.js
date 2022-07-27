import { bindPostClickListener, renderPosts } from './render-posts.js';
import { getData } from './api.js';
import { openBigPicture } from './big-picture-render.js';
import './post-creation.js';
import { initPostsFilter } from './posts-filter.js';

getData((posts) => {
  renderPosts(posts);
  bindPostClickListener((postId) => {
    const POST = posts.find((post) => post.id === Number(postId));
    openBigPicture(POST);
  });
  initPostsFilter(posts);
});
