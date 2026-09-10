#!/usr/bin/env bash
# Add a note to a topic folder.
#
#   ./new-note.sh entra-id "Conditional access excludes break-glass account"
#
# Appends the note to notes/<slug>.html, creating the folder page and its
# entry in data/notes.js if they don't exist yet, and keeps the count current.

set -euo pipefail

if [ $# -lt 2 ]; then
  echo 'usage: ./new-note.sh <folder-slug> "Note title"'
  echo -n 'existing folders: '
  grep -o 'slug: "[a-z0-9-]*"' data/notes.js | sed 's/slug: //;s/"//g' | tr '\n' ' '
  echo
  exit 1
fi

python3 - "$1" "$2" "$(date '+%B %-d, %Y')" <<'PYEOF'
import io, os, sys, html, re

slug, title, date_label = sys.argv[1:4]
esc_title = html.escape(title)
page = f"notes/{slug}.html"

data = io.open("data/notes.js", encoding="utf-8").read()

# register the folder if it is new
if f'slug: "{slug}"' not in data:
    label = slug.replace("-", " ").title()
    entry = f'  {{ slug: "{slug}", label: "{label}", summary: "", count: 0 }},\n'
    marker = "window.IAM_NOTES = [\n"
    data = data.replace(marker, marker + entry, 1)
    io.open("data/notes.js", "w", encoding="utf-8").write(data)

m = re.search(r'\{ slug: "%s", label: "([^"]*)", summary: "([^"]*)", count: (\d+) \}' % re.escape(slug), data)
label, summary, count = (m.group(1), m.group(2), int(m.group(3))) if m else (slug, "", 0)

# create the folder page if it is new
if not os.path.exists(page):
    tpl = io.open("notes/_template.html", encoding="utf-8").read()
    io.open(page, "w", encoding="utf-8").write(
        tpl.replace("__LABEL__", html.escape(label)).replace("__SUMMARY__", html.escape(summary)))

# append the note
body = io.open(page, encoding="utf-8").read()
body = body.replace('      <p class="empty">No notes in this folder yet.</p>\n', "", 1)
note = (f'      <div class="note-entry">\n'
        f'        <h2>{esc_title}</h2>\n'
        f'        <p class="post-meta">{date_label}</p>\n'
        f'        <p>Write the note here.</p>\n'
        f'      </div>\n\n')
body = body.replace("      <!-- NOTES:END -->", note + "      <!-- NOTES:END -->", 1)
io.open(page, "w", encoding="utf-8").write(body)

# bump the count
data = io.open("data/notes.js", encoding="utf-8").read()
data = re.sub(r'(\{ slug: "%s".*?count: )(\d+)' % re.escape(slug),
              lambda mm: mm.group(1) + str(int(mm.group(2)) + 1), data, count=1)
io.open("data/notes.js", "w", encoding="utf-8").write(data)

print(f"added note to {page}")
PYEOF
