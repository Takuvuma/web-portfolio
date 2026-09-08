document.getElementById("year").textContent = new Date().getFullYear();

// Highlight the nav link for the section currently in view.
const links = new Map(
  [...document.querySelectorAll(".site-header nav a")].map((a) => [a.getAttribute("href").slice(1), a])
);

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const link = links.get(entry.target.id);
      if (link) link.style.color = entry.isIntersecting ? "var(--clay-dark)" : "";
    }
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

for (const id of links.keys()) {
  const section = document.getElementById(id);
  if (section) observer.observe(section);
}
