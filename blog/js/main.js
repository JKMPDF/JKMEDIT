// Renders category filters and the post list on the homepage.
// The newest post is featured full-width; the rest show in a grid.

const postList = document.getElementById("post-list");
const filtersEl = document.getElementById("category-filters");
let activeCategory = "All";

function formatDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function postUrl(post) {
  // posts/<category>/<slug>.html — folder is the lowercase category name
  return `posts/${post.category.toLowerCase()}/${post.slug}.html`;
}

function renderFilters() {
  filtersEl.innerHTML = CATEGORIES
    .map(
      (cat) => `
      <button class="filter-btn${cat === activeCategory ? " active" : ""}" data-category="${cat}">
        ${cat}
      </button>`
    )
    .join("");

  filtersEl.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderFilters();
      renderPosts();
    });
  });
}

function metaHtml(post) {
  return `
    <div class="post-meta">
      <span class="category-badge">${post.category}</span>
      <span class="post-date">${formatDate(post.date)}</span>
    </div>`;
}

function cardHtml(post) {
  return `
    <article class="post-card">
      <a class="card-image" href="${postUrl(post)}">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </a>
      <div class="card-body">
        ${metaHtml(post)}
        <h3><a href="${postUrl(post)}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <a class="read-more" href="${postUrl(post)}">Read more &rarr;</a>
      </div>
    </article>`;
}

function featuredHtml(post) {
  return `
    <article class="post-card featured">
      <a class="card-image" href="${postUrl(post)}">
        <img src="${post.image}" alt="${post.title}">
      </a>
      <div class="featured-body">
        <span class="featured-label">Latest</span>
        ${metaHtml(post)}
        <h3><a href="${postUrl(post)}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <a class="read-more" href="${postUrl(post)}">Read more &rarr;</a>
      </div>
    </article>`;
}

function renderPosts() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const filtered =
    activeCategory === "All"
      ? sorted
      : sorted.filter((p) => p.category === activeCategory);

  if (!filtered.length) {
    postList.innerHTML = '<p class="post-empty">No posts in this category yet.</p>';
    return;
  }

  // When viewing "All", the newest post gets the featured treatment.
  const [featured, ...rest] = activeCategory === "All" ? filtered : [null, ...filtered];

  postList.innerHTML =
    (featured ? featuredHtml(featured) : "") +
    `<div class="post-grid">${rest.map(cardHtml).join("")}</div>`;
}

renderFilters();
renderPosts();
