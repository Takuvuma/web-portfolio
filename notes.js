/* Renders folder tiles from window.IAM_NOTES (see data/notes.js). */
(function () {
  const grid = document.getElementById("note-folders");
  if (!grid) return;

  const folders = window.IAM_NOTES || [];
  if (!folders.length) {
    grid.innerHTML = '<li class="empty">No folders yet.</li>';
    return;
  }

  grid.innerHTML = folders.map((f) => {
    const n = f.count || 0;
    const label = n === 1 ? "1 note" : `${n} notes`;
    return `<li>
      <a class="folder" href="notes/${f.slug}.html">
        <span class="folder-tab"></span>
        <span class="folder-body">
          <span class="folder-name">${f.label}</span>
          <span class="folder-summary">${f.summary || ""}</span>
          <span class="folder-count">${label}</span>
        </span>
      </a>
    </li>`;
  }).join("");
})();
