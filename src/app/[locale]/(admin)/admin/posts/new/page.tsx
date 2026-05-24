import PostForm from "../components/PostForm";
import { useTranslations } from "next-intl";

export default function NewPostPage() {
  const t = useTranslations("postsNew");
  return <PostForm title={t("title")} />;
}
