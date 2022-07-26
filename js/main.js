import { createRandomPosts, POSTS_COUNT } from "./data";
import { renderPosts } from "./render-posts";

renderPosts(createRandomPosts(POSTS_COUNT));