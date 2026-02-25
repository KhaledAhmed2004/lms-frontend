import PostForm from "../components/PostForm";
import { newPostDefaults } from "../components/posts-data";

export default function NewPostPage() {
  return <PostForm title="New Post" post={newPostDefaults} />;
}
