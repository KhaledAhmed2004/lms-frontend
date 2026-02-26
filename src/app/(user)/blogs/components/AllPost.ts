import type { BlogPost, PlatformMetadata } from "./types";

export const platformMetadata: PlatformMetadata = {
  categories: ["Math", "Languages", "Study Tips", "Exam Prep", "Abitur"],
  tags: [
    "#Grade 10",
    "#Grade 12",
    "#Vocabulary",
    "#Calculus",
    "#Writing",
    "#Finals",
  ],
};

export const postsData: BlogPost[] = [
  {
    id: "1",
    title: "How to Ace Your Abitur: A Complete 8-Week Study Plan",
    author: "Lisa M.",
    author_role: "Mathematics Tutor",
    date: "Feb 18, 2026",
    read_time: "8 min read",
    views: 4821,
    category: "Abitur",
    tags: ["#Grade 12"],
    featured: true,
    summary:
      "A structured, week-by-week approach to Abitur preparation covering all major subjects. Learn how top students organize their time and stay focused under pressure.",
    slug: "how-to-ace-your-abitur-a-complete-8-week-study-plan",
    seoTitle: "How to Ace Your Abitur: A Complete 8-Week Study Plan",
    seoDescription:
      "A focused plan to help students prepare for the Abitur with confidence. Learn structured strategies from top performers.",
    cta: "Book Free Trial",
    status: "Published",
    image_url: "/images/abitur-study-plan.jpg",
    author_avatar_url: "/avatars/lisa-m.jpg",
    content_sections: [
      {
        heading: "Introduction",
        body: "Learning effectively requires more than just working hard — it requires working smart. In this article, we'll walk you through the most effective strategies used by top-performing students across Germany.",
      },
      {
        heading: "Key Concepts",
        body: "Before diving in, let's establish the foundational principles. Research consistently shows that spaced repetition, active recall, and interleaving practice outperform passive reading and re-reading by a significant margin.",
      },
      {
        heading: "Step-by-Step Guide",
        body: "Start by creating a clear study schedule at least 6-8 weeks before your exam. Break down each subject into manageable chunks and allocate specific time blocks. Use past papers from the last 5 years as your primary revision tool.",
      },
      {
        heading: "Common Mistakes to Avoid",
        body: "The biggest mistake students make is starting too late and relying on cramming. Another common pitfall is studying topics in isolation without connecting them. Always look for patterns across topics.",
      },
      {
        heading: "Summary & Next Steps",
        body: "With a solid plan and the right techniques, success is well within reach. If you'd like personal guidance from an expert tutor, book a free trial session with us today.",
      },
    ],
  },
  {
    id: "2",
    title: "Understanding Derivatives: The Visual Way",
    author: "Luca S.",
    author_role: "Mathematics Tutor",
    date: "Feb 14, 2026",
    read_time: "6 min read",
    views: 3102,
    category: "Math",
    tags: ["#Calculus", "#Grade 12"],
    featured: false,
    image_url: "",
    author_avatar_url: "/avatars/lisa-m.jpg",
    summary:
      "Stop memorizing formulas. This guide teaches you to actually understand derivatives through visual intuition.",
    slug: "understanding-derivatives-the-visual-way",
    seoTitle: "Understanding Derivatives: The Visual Way",
    seoDescription:
      "Learn derivatives through visual explanations and real-world intuition. Master calculus concepts that stick.",
    cta: "Book Free Trial",
    status: "Published",
    content_sections: [
      {
        heading: "Introduction",
        body: "Learning effectively requires more than just working hard — it requires working smart. In this article, we'll walk you through the most effective strategies used by top-performing students across Germany.",
      },
      {
        heading: "Key Concepts",
        body: "Before diving in, let's establish the foundational principles. Research consistently shows that spaced repetition, active recall, and interleaving practice outperform passive reading and re-reading by a significant margin.",
      },
      {
        heading: "Step-by-Step Guide",
        body: "Start by creating a clear study schedule at least 6-8 weeks before your exam. Break down each subject into manageable chunks and allocate specific time blocks. Use past papers from the last 5 years as your primary revision tool.",
      },
      {
        heading: "Common Mistakes to Avoid",
        body: "The biggest mistake students make is starting too late and relying on cramming. Another common pitfall is studying topics in isolation without connecting them. Always look for patterns across topics.",
      },
      {
        heading: "Summary & Next Steps",
        body: "With a solid plan and the right techniques, success is well within reach. If you'd like personal guidance from an expert tutor, book a free trial session with us today.",
      },
    ],
  },
  {
    id: "3",
    title: "5 Proven Techniques to Build English Vocabulary Fast",
    author: "Yumi K.",
    date: "Feb 10, 2026",
    read_time: "5 min read",
    author_role: "Mathematics Tutor",
    views: 2830,
    category: "Languages",
    image_url: "",
    author_avatar_url: "/avatars/lisa-m.jpg",
    tags: ["#Vocabulary", "#Writing"],
    featured: false,
    summary:
      "Vocabulary doesn't have to be boring flashcards. These five science-backed methods will help you retain words longer.",
    slug: "5-proven-techniques-to-build-english-vocabulary-fast",
    seoTitle: "5 Proven Techniques to Build English Vocabulary Fast",
    seoDescription:
      "Science-backed vocabulary building methods that help you retain words longer without boring flashcards.",
    cta: "Book Free Trial",
    status: "Published",
    content_sections: [
      {
        heading: "Introduction",
        body: "Learning effectively requires more than just working hard — it requires working smart. In this article, we'll walk you through the most effective strategies used by top-performing students across Germany.",
      },
      {
        heading: "Key Concepts",
        body: "Before diving in, let's establish the foundational principles. Research consistently shows that spaced repetition, active recall, and interleaving practice outperform passive reading and re-reading by a significant margin.",
      },
      {
        heading: "Step-by-Step Guide",
        body: "Start by creating a clear study schedule at least 6-8 weeks before your exam. Break down each subject into manageable chunks and allocate specific time blocks. Use past papers from the last 5 years as your primary revision tool.",
      },
      {
        heading: "Common Mistakes to Avoid",
        body: "The biggest mistake students make is starting too late and relying on cramming. Another common pitfall is studying topics in isolation without connecting them. Always look for patterns across topics.",
      },
      {
        heading: "Summary & Next Steps",
        body: "With a solid plan and the right techniques, success is well within reach. If you'd like personal guidance from an expert tutor, book a free trial session with us today.",
      },
    ],
  },
  {
    id: "4",
    title: "The Pomodoro Technique: Does It Actually Work for Students?",
    author: "Diego R.",
    date: "Feb 5, 2026",
    read_time: "4 min read",
    author_role: "Mathematics Tutor",
    views: 1944,
    category: "Study Tips",
    tags: ["#Focus", "#Productivity"],
    featured: false,
    image_url: "",
    author_avatar_url: "/avatars/lisa-m.jpg",
    summary:
      "We tested the Pomodoro method with 30 students over 6 weeks. Here's what the data showed about productivity and focus.",
    slug: "the-pomodoro-technique-does-it-actually-work-for-students",
    seoTitle: "The Pomodoro Technique: Does It Actually Work for Students?",
    seoDescription:
      "Data-driven analysis of the Pomodoro technique with real results from 30 students over 6 weeks.",
    cta: "Book Free Trial",
    status: "Published",
    content_sections: [
      {
        heading: "Introduction",
        body: "Learning effectively requires more than just working hard — it requires working smart. In this article, we'll walk you through the most effective strategies used by top-performing students across Germany.",
      },
      {
        heading: "Key Concepts",
        body: "Before diving in, let's establish the foundational principles. Research consistently shows that spaced repetition, active recall, and interleaving practice outperform passive reading and re-reading by a significant margin.",
      },
      {
        heading: "Step-by-Step Guide",
        body: "Start by creating a clear study schedule at least 6-8 weeks before your exam. Break down each subject into manageable chunks and allocate specific time blocks. Use past papers from the last 5 years as your primary revision tool.",
      },
      {
        heading: "Common Mistakes to Avoid",
        body: "The biggest mistake students make is starting too late and relying on cramming. Another common pitfall is studying topics in isolation without connecting them. Always look for patterns across topics.",
      },
      {
        heading: "Summary & Next Steps",
        body: "With a solid plan and the right techniques, success is well within reach. If you'd like personal guidance from an expert tutor, book a free trial session with us today.",
      },
    ],
  },
  {
    id: "5",
    title: "How to Write a Perfect Essay Under Exam Conditions",
    author: "Emma K.",
    date: "Jan 28, 2026",
    author_role: "Mathematics Tutor",
    read_time: "7 min read",
    views: 2311,
    category: "Exam Prep",
    image_url: "",
    author_avatar_url: "/avatars/lisa-m.jpg",
    tags: ["#Writing", "#Exam Prep"],
    featured: false,
    summary:
      "From structuring arguments to managing time pressure — everything you need to write a compelling essay when the clock is ticking.",
    slug: "how-to-write-a-perfect-essay-under-exam-conditions",
    seoTitle: "How to Write a Perfect Essay Under Exam Conditions",
    seoDescription:
      "Master essay writing under pressure with proven structures, time management, and argument techniques.",
    cta: "Book Free Trial",
    status: "Published",
    content_sections: [
      {
        heading: "Introduction",
        body: "Learning effectively requires more than just working hard — it requires working smart. In this article, we'll walk you through the most effective strategies used by top-performing students across Germany.",
      },
      {
        heading: "Key Concepts",
        body: "Before diving in, let's establish the foundational principles. Research consistently shows that spaced repetition, active recall, and interleaving practice outperform passive reading and re-reading by a significant margin.",
      },
      {
        heading: "Step-by-Step Guide",
        body: "Start by creating a clear study schedule at least 6-8 weeks before your exam. Break down each subject into manageable chunks and allocate specific time blocks. Use past papers from the last 5 years as your primary revision tool.",
      },
      {
        heading: "Common Mistakes to Avoid",
        body: "The biggest mistake students make is starting too late and relying on cramming. Another common pitfall is studying topics in isolation without connecting them. Always look for patterns across topics.",
      },
      {
        heading: "Summary & Next Steps",
        body: "With a solid plan and the right techniques, success is well within reach. If you'd like personal guidance from an expert tutor, book a free trial session with us today.",
      },
    ],
  },
  {
    id: "6",
    title: "Become a Tutor: Is Online Tutoring Right for You?",
    author: "Simon S.",
    date: "Jan 20, 2026",
    author_role: "Mathematics Tutor",
    read_time: "5 min read",
    image_url: "",
    author_avatar_url: "/avatars/lisa-m.jpg",
    views: 1587,
    category: "Abitur",
    tags: ["#Career", "#Tutoring"],
    featured: false,
    summary:
      "Thinking about sharing your knowledge and earning while studying? Here's an honest look at the pros and cons of online tutoring.",
    slug: "become-a-tutor-is-online-tutoring-right-for-you",
    seoTitle: "Become a Tutor: Is Online Tutoring Right for You?",
    seoDescription:
      "An honest assessment of online tutoring opportunities, earnings potential, and whether it's right for you.",
    cta: "Apply as Tutor",
    status: "Published",
    content_sections: [
      {
        heading: "Introduction",
        body: "Learning effectively requires more than just working hard — it requires working smart. In this article, we'll walk you through the most effective strategies used by top-performing students across Germany.",
      },
      {
        heading: "Key Concepts",
        body: "Before diving in, let's establish the foundational principles. Research consistently shows that spaced repetition, active recall, and interleaving practice outperform passive reading and re-reading by a significant margin.",
      },
      {
        heading: "Step-by-Step Guide",
        body: "Start by creating a clear study schedule at least 6-8 weeks before your exam. Break down each subject into manageable chunks and allocate specific time blocks. Use past papers from the last 5 years as your primary revision tool.",
      },
      {
        heading: "Common Mistakes to Avoid",
        body: "The biggest mistake students make is starting too late and relying on cramming. Another common pitfall is studying topics in isolation without connecting them. Always look for patterns across topics.",
      },
      {
        heading: "Summary & Next Steps",
        body: "With a solid plan and the right techniques, success is well within reach. If you'd like personal guidance from an expert tutor, book a free trial session with us today.",
      },
    ],
  },
];
