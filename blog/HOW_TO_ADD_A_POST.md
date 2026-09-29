# How to Add a New Blog Post (3-Step Workflow)

The blog architecture is designed to be completely scalable and low-maintenance. Adding a new blog post requires only three quick steps:

---

## Step 1: Duplicate `blog/_template.html`

1. Duplicate `blog/_template.html` and name the new file with your post's slug (e.g. `blog/my-new-android-post.html`).
2. Search for all `{{PLACEHOLDER}}` tags in the file and fill them in:
   - `{{POST_TITLE}}`: Post title (e.g., *Mastering Kotlin Coroutines and StateFlow in Android*)
   - `{{POST_SLUG}}`: URL slug matching your filename without `.html` (e.g., `my-new-android-post`)
   - `{{POST_EXCERPT_150_160_CHARS}}`: 150-160 character summary for search engines
   - `{{COVER_IMAGE_PATH}}`: Path to image (e.g., `/assets/my-new-post-og.jpg`)
   - `{{YYYY-MM-DD}}`: ISO date (e.g., `2026-10-05`)
   - `{{CATEGORY}}`: Category badge text (e.g., `Architecture`, `Tutorial`, `Case Study`)
   - `{{READ_TIME}}`: Estimated read time in minutes (~200 words per minute)
3. Write your article body in the `<section class="article-body">` element. Use standard semantic HTML (`<h2>`, `<h3>`, `<p>`, `<ul>`, `<pre><code>`).
4. In the dynamic related articles script at the bottom of the file, set:
   ```js
   const currentSlug = 'my-new-android-post';
   ```

---

## Step 2: Add Entry in `blog/posts-data.js`

Open `blog/posts-data.js` and add a new item at the top of the `POSTS` array:

```javascript
{
  slug: "my-new-android-post",
  title: "Mastering Kotlin Coroutines and StateFlow in Android",
  excerpt: "In-depth guide on utilizing Kotlin Coroutines, StateFlow, and SharedFlow for resilient, lifecycle-aware asynchronous streams in modern Android.",
  category: "Architecture",
  tags: ["Kotlin", "Coroutines", "StateFlow", "Android"],
  datePublished: "2026-10-05",
  dateModified: "2026-10-05",
  readTimeMinutes: 7,
  featured: true, // Set to true to show in the homepage's featured articles section (max 3 featured)
  coverImage: "/assets/my-new-post-og.jpg"
},
```

> **Why this matters:**
> - The `/blog/` listing page automatically renders cards for all posts in `POSTS` sorted by `datePublished`.
> - The homepage automatically displays up to 3 posts marked with `featured: true`.
> - Individual articles automatically fetch related posts excluding their own slug.

---

## Step 3: Add the URL to `sitemap.xml`

Open `sitemap.xml` and insert the new URL:

```xml
<url>
    <loc>https://saadev.site/blog/my-new-android-post</loc>
    <lastmod>2026-10-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
```

---

## Deploying

Deploy to Firebase Hosting with:

```bash
firebase deploy --only hosting:saadev-portfolio
```

Or commit and push to Git:
```bash
git add .
git commit -m "feat(blog): add my-new-android-post"
git push origin main
```
