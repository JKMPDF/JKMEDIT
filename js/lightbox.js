// Lightbox: click any image inside an article to view it full-size.
// Works for cover/hero images and inline content images.

(function () {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.innerHTML = '<img class="lightbox-img" alt=""><button class="lightbox-close" aria-label="Close">&times;</button>';
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".lightbox-img");

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    img.src = "";
  }

  // Only images that are direct content (not inside links/cards)
  document.querySelectorAll(".post img, .post-hero img").forEach((el) => {
    if (el.closest("a")) return;
    el.classList.add("zoomable");
    el.addEventListener("click", () => open(el.src, el.alt));
  });

  overlay.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
