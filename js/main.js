import { createRandomPosts, POSTS_COUNT } from "./data";
import { renderPosts } from "./render-posts";

const POSTS = createRandomPosts(POSTS_COUNT);
renderPosts(POSTS);

bindPostClickListener((postId) => {
    const currentPost = POSTS.find((post) => post.id === postId);
    openBigPicture(currentPost);
});
