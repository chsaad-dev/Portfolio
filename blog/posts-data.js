/**
 * Centralized Blog / Articles Data Store
 * Adding a new blog post requires only adding an entry to this array,
 * placing the HTML file in /blog/<slug>.html, and adding the URL to sitemap.xml.
 */

export const POSTS = [
  {
    slug: "why-you-shouldnt-put-secret-api-keys-in-your-android-app",
    title: "Why You Shouldn't Put Secret API Keys Directly in Your Android App",
    excerpt: "Any API key you put inside an Android app can be pulled out in minutes. Here is what I learned building a proxy with Cloudflare Workers instead.",
    category: "Developer Notes",
    tags: ["Android", "Security", "Cloudflare Workers", "API Design"],
    datePublished: "2026-09-29",
    dateModified: "2026-09-29",
    readTimeMinutes: 5,
    featured: true,
    coverImage: "/assets/og-image.jpg"
  },
  {
    slug: "giveease-case-study",
    title: "How I Built GiveEase: A Verified Donation Platform Using Kotlin & Firebase",
    excerpt: "Technical deep dive into GiveEase, a verified Android donation platform built with Kotlin, Firebase Auth, Cloud Firestore, and clean MVVM architecture patterns.",
    category: "Case Study",
    tags: ["Kotlin", "Firebase", "Android", "MVVM", "Firestore"],
    datePublished: "2026-07-19",
    dateModified: "2026-07-30",
    readTimeMinutes: 8,
    featured: true,
    coverImage: "/assets/giveease-og.jpg"
  },
  {
    slug: "spendwise-case-study",
    title: "SpendWise: Building an Offline-First Expense Tracker with Room Database",
    excerpt: "Architecting SpendWise, an offline-first Android expense tracker with Room SQLite database, Jetpack Compose, Material 3, and zero-latency local operations.",
    category: "Case Study",
    tags: ["Room SQLite", "Jetpack Compose", "Kotlin", "Offline-First", "Material 3"],
    datePublished: "2026-07-19",
    dateModified: "2026-07-30",
    readTimeMinutes: 6,
    featured: true,
    coverImage: "/assets/spendwise-og.jpg"
  },
  {
    slug: "jetpack-compose-vs-xml",
    title: "Jetpack Compose vs XML: Why I Switched for My Latest Projects",
    excerpt: "A performance, syntax, and maintainability comparison between declarative Jetpack Compose composables and traditional Android XML view hierarchies.",
    category: "UI Architecture",
    tags: ["Jetpack Compose", "Android XML", "UI Performance", "Kotlin", "Declarative UI"],
    datePublished: "2026-07-19",
    dateModified: "2026-07-30",
    readTimeMinutes: 6,
    featured: true,
    coverImage: "/assets/og-image.jpg"
  }
];

/**
 * Helper utilities for rendering articles
 */
export function getAllPosts() {
  return [...POSTS].sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
}

export function getFeaturedPosts(limit = 3) {
  return getAllPosts().filter(p => p.featured).slice(0, limit);
}

export function getRelatedPosts(currentSlug, limit = 2) {
  const current = POSTS.find(p => p.slug === currentSlug);
  const others = POSTS.filter(p => p.slug !== currentSlug);
  if (!current) return others.slice(0, limit);

  // Score by shared tags or category
  const scored = others.map(post => {
    let score = 0;
    if (post.category === current.category) score += 2;
    post.tags.forEach(t => {
      if (current.tags.includes(t)) score += 1;
    });
    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(item => item.post);
}

export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Global window exposure for browser scripts
if (typeof window !== 'undefined') {
  window.POSTS_DATA = { POSTS, getAllPosts, getFeaturedPosts, getRelatedPosts, formatDate };
}
