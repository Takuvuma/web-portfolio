/* Renders the blog index from window.IAM_POSTS (see data/posts.js). */
(function () {
  const list = document.getElementById("post-list");
  if (!list) return;

  const posts = [...(window.IAM_POSTS || [])].sort((a, b) => (a.date < b.date ? 1 : -1));

  if (!posts.length) {
    list.innerHTML = `<li class="empty">
      No posts yet. Scaffold the first one with <code>./new-post.sh "Your title"</code>.
    </li>`;
    return;
  }

  list.innerHTML = posts.map((p) => {
    const when = new Date(p.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
    const tags = (p.tags || []).map((t) => `<span>${t}</span>`).join("");
    const read = p.minutes ? ` · ${p.minutes} min read` : "";
    return `<li class="post-card">
      <a class="post-link" href="posts/${p.slug}.html">
        <p class="post-meta">${when}${read}</p>
        <h3>${p.title}</h3>
        <p class="post-summary">${p.summary || ""}</p>
        ${tags ? `<p class="post-tags">${tags}</p>` : ""}
      </a>
    </li>`;
  }).join("");
})();
