// Post index — metadata only. The homepage reads this to build the
// post list and category filters.
//
// Each post lives in its own category folder:
//   posts/<category>/<slug>.html        ← the post page
//   posts/<category>/assets/            ← that category's images
//
// Folder name = category name in lowercase (e.g. "Ayurveda" → posts/ayurveda/)
//
// To publish a post:
//   1. Create posts/<category>/<slug>.html (copy a post from the same category)
//   2. Put images in posts/<category>/assets/
//   3. Add an entry below — slug must match the file name
//   4. Save — it appears on the homepage automatically

const CATEGORIES = ["All", "Finance", "Account", "GST", "Health", "Ayurveda", "Mahi", "Others"];

const POSTS = [
  {
    slug: "budgeting-101",
    title: "Budgeting 101: Where to Start",
    date: "2026-11-12",
    category: "Finance",
    image: "posts/finance/assets/budgeting-101.svg",
    excerpt: "A simple framework for managing your money without stress."
  },
 {
    slug: "what-is-present-value",
    title: "what-is-present-value",
    date: "2026-11-13",
    category: "Finance",
    image: "posts/finance/assets/what-is-present-value.svg",
    excerpt: "Know how to calculate present value of future cashflow."
  },
  {
    slug: "morning-routine-for-energy",
    title: "My Morning Routine for All-Day Energy",
    date: "2026-11-11",
    category: "Health",
    image: "posts/health/assets/morning-routine.svg",
    excerpt: "Small habits that changed how I feel every morning."
  },
  {
    slug: "doshas-explained",
    title: "Ayurveda Basics: Understanding the Three Doshas",
    date: "2026-11-10",
    category: "Ayurveda",
    image: "posts/ayurveda/assets/doshas-explained.svg",
    excerpt: "Vata, Pitta, and Kapha — what they mean for your health."
  },
  {
    slug: "hello-world",
    title: "Hello, World!",
    date: "2026-11-09",
    category: "Others",
    image: "posts/others/assets/hello-world.svg",
    excerpt: "The first post on this brand new blog."
  },
  {
    slug: "getting-started-with-html-css-js",
    title: "Getting Started with HTML, CSS, and JavaScript",
    date: "2026-11-08",
    category: "Others",
    image: "posts/others/assets/getting-started-with-html-css-js.svg",
    excerpt: "A quick overview of the three core technologies behind every website."
  },
  {
    slug: "why-i-built-this-blog",
    title: "Why I Built This Blog",
    date: "2026-11-07",
    category: "Others",
    image: "posts/others/assets/why-i-built-this-blog.svg",
    excerpt: "No frameworks, no build tools — just plain HTML, CSS, and JS."
  },
  {
    slug: "responsive-design-tips",
    title: "5 Tips for Responsive Web Design",
    date: "2026-11-06",
    category: "Others",
    image: "posts/others/assets/responsive-design-tips.svg",
    excerpt: "Make your site look great on every screen size."
  },
  {
    slug: "my-first-side-project",
    title: "My First Side Project: A Habit Tracker",
    date: "2026-11-05",
    category: "Others",
    image: "posts/others/assets/my-first-side-project.svg",
    excerpt: "What I built, what I learned, and what's next."
  }
];
