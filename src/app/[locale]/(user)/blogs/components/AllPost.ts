import type { BlogPost, PlatformMetadata } from "./types";

type TFn = (key: string) => string;

export function getPlatformMetadata(t: TFn): PlatformMetadata {
  return {
    categories: [
      t("cat_math"),
      t("cat_languages"),
      t("cat_studyTips"),
      t("cat_examPrep"),
      t("cat_abitur"),
    ],
    tags: [
      t("tag_grade10"),
      t("tag_grade12"),
      t("tag_vocabulary"),
      t("tag_calculus"),
      t("tag_writing"),
      t("tag_finals"),
    ],
  };
}

// Shared content sections for posts 2-6 (same body as post 1)
function sharedSections(t: TFn) {
  return [
    { heading: t("post1_s1_heading"), body: t("post1_s1_body") },
    { heading: t("post1_s2_heading"), body: t("post1_s2_body") },
    { heading: t("post1_s3_heading"), body: t("post1_s3_body") },
    { heading: t("post1_s4_heading"), body: t("post1_s4_body") },
    { heading: t("post1_s5_heading"), body: t("post1_s5_body") },
  ];
}

export function getPostsData(t: TFn): BlogPost[] {
  return [
    {
      id: "1",
      title: t("post1_title"),
      author: t("post1_author"),
      author_role: t("post1_author_role"),
      date: t("post1_date"),
      read_time: t("post1_read_time"),
      views: 4821,
      category: t("cat_abitur"),
      tags: [t("tag_grade12")],
      featured: true,
      summary:
        "A structured, week-by-week approach to Abitur preparation covering all major subjects. Learn how top students organize their time and stay focused under pressure.",
      slug: "how-to-ace-your-abitur-a-complete-8-week-study-plan",
      seoTitle: "How to Ace Your Abitur: A Complete 8-Week Study Plan",
      seoDescription:
        "A focused plan to help students prepare for the Abitur with confidence. Learn structured strategies from top performers.",
      cta: t("cta_bookTrial"),
      status: t("status_published"),
      image_url: "/images/abitur-study-plan.jpg",
      author_avatar_url: "/avatars/lisa-m.jpg",
      content_sections: sharedSections(t),
    },
    {
      id: "2",
      title: t("post2_title"),
      author: t("post2_author"),
      author_role: t("post2_author_role"),
      date: t("post2_date"),
      read_time: t("post2_read_time"),
      views: 3102,
      category: t("cat_math"),
      tags: [t("tag_calculus"), t("tag_grade12")],
      featured: false,
      image_url: "",
      author_avatar_url: "/avatars/lisa-m.jpg",
      summary:
        "Stop memorizing formulas. This guide teaches you to actually understand derivatives through visual intuition.",
      slug: "understanding-derivatives-the-visual-way",
      seoTitle: "Understanding Derivatives: The Visual Way",
      seoDescription:
        "Learn derivatives through visual explanations and real-world intuition. Master calculus concepts that stick.",
      cta: t("cta_bookTrial"),
      status: t("status_published"),
      content_sections: sharedSections(t),
    },
    {
      id: "3",
      title: t("post3_title"),
      author: t("post3_author"),
      date: t("post3_date"),
      read_time: t("post3_read_time"),
      author_role: t("post3_author_role"),
      views: 2830,
      category: t("cat_languages"),
      image_url: "",
      author_avatar_url: "/avatars/lisa-m.jpg",
      tags: [t("tag_vocabulary"), t("tag_writing")],
      featured: false,
      summary:
        "Vocabulary doesn't have to be boring flashcards. These five science-backed methods will help you retain words longer.",
      slug: "5-proven-techniques-to-build-english-vocabulary-fast",
      seoTitle: "5 Proven Techniques to Build English Vocabulary Fast",
      seoDescription:
        "Science-backed vocabulary building methods that help you retain words longer without boring flashcards.",
      cta: t("cta_bookTrial"),
      status: t("status_published"),
      content_sections: sharedSections(t),
    },
    {
      id: "4",
      title: t("post4_title"),
      author: t("post4_author"),
      date: t("post4_date"),
      read_time: t("post4_read_time"),
      author_role: t("post4_author_role"),
      views: 1944,
      category: t("cat_studyTips"),
      tags: [t("tag_writing"), t("tag_finals")],
      featured: false,
      image_url: "",
      author_avatar_url: "/avatars/lisa-m.jpg",
      summary:
        "We tested the Pomodoro method with 30 students over 6 weeks. Here's what the data showed about productivity and focus.",
      slug: "the-pomodoro-technique-does-it-actually-work-for-students",
      seoTitle: "The Pomodoro Technique: Does It Actually Work for Students?",
      seoDescription:
        "Data-driven analysis of the Pomodoro technique with real results from 30 students over 6 weeks.",
      cta: t("cta_bookTrial"),
      status: t("status_published"),
      content_sections: sharedSections(t),
    },
    {
      id: "5",
      title: t("post5_title"),
      author: t("post5_author"),
      date: t("post5_date"),
      author_role: t("post5_author_role"),
      read_time: t("post5_read_time"),
      views: 2311,
      category: t("cat_examPrep"),
      image_url: "",
      author_avatar_url: "/avatars/lisa-m.jpg",
      tags: [t("tag_writing"), t("cat_examPrep")],
      featured: false,
      summary:
        "From structuring arguments to managing time pressure — everything you need to write a compelling essay when the clock is ticking.",
      slug: "how-to-write-a-perfect-essay-under-exam-conditions",
      seoTitle: "How to Write a Perfect Essay Under Exam Conditions",
      seoDescription:
        "Master essay writing under pressure with proven structures, time management, and argument techniques.",
      cta: t("cta_bookTrial"),
      status: t("status_published"),
      content_sections: sharedSections(t),
    },
    {
      id: "6",
      title: t("post6_title"),
      author: t("post6_author"),
      date: t("post6_date"),
      author_role: t("post6_author_role"),
      read_time: t("post6_read_time"),
      image_url: "",
      author_avatar_url: "/avatars/lisa-m.jpg",
      views: 1587,
      category: t("cat_abitur"),
      tags: [t("tag_grade12"), t("tag_vocabulary")],
      featured: false,
      summary:
        "Thinking about sharing your knowledge and earning while studying? Here's an honest look at the pros and cons of online tutoring.",
      slug: "become-a-tutor-is-online-tutoring-right-for-you",
      seoTitle: "Become a Tutor: Is Online Tutoring Right for You?",
      seoDescription:
        "An honest assessment of online tutoring opportunities, earnings potential, and whether it's right for you.",
      cta: t("cta_applyTutor"),
      status: t("status_published"),
      content_sections: sharedSections(t),
    },
  ];
}

// Backwards-compat stubs — consuming files are migrated below
export const platformMetadata: PlatformMetadata = {
  categories: ["Math", "Languages", "Study Tips", "Exam Prep", "Abitur"],
  tags: ["#Grade 10", "#Grade 12", "#Vocabulary", "#Calculus", "#Writing", "#Finals"],
};
export const postsData: BlogPost[] = [];
