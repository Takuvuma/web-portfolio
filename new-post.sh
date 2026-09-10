#!/usr/bin/env bash
# Scaffold a blog post and register it on the home page.
#
#   ./new-post.sh "Tuning Entra ID conditional access without locking myself out"
#
# Creates posts/<slug>.html from the template and adds an entry to
# data/posts.js. Edit the HTML, then commit and push.

set -euo pipefail

if [ $# -lt 1 ]; then
  echo 'usage: ./new-post.sh "Post title"'
  exit 1
fi

title=$1
date=$(date +%Y-%m-%d)
date_label=$(date "+%B %-d, %Y")

slug=$(printf '%s' "$title" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -e 's/[^a-z0-9]\{1,\}/-/g' -e 's/^-//' -e 's/-$//')

file="posts/$slug.html"
if [ -e "$file" ]; then
  echo "error: $file already exists"
  exit 1
fi

summary="One or two sentences summarising the post."

python3 - "$file" "$title" "$date" "$date_label" "$summary" <<'PYEOF'
import io, sys, html

path, title, date, date_label, summary = sys.argv[1:6]
slug = path.split("/")[-1][:-5]
esc = html.escape(title)

tpl = io.open("posts/_template.html", encoding="utf-8").read()
page = (tpl.replace("__TITLE__", esc)
           .replace("__DATE_LABEL__", date_label)
           .replace("__SUMMARY__", html.escape(summary)))
io.open(path, "w", encoding="utf-8").write(page)

entry = ('  { slug: "%s", title: "%s", date: "%s", minutes: 5,\n'
         '    summary: "%s",\n'
         '    tags: ["IAM"] },\n') % (slug, title.replace('"', '\\"'), date, summary)

p = "data/posts.js"
s = io.open(p, encoding="utf-8").read()
marker = "window.IAM_POSTS = [\n"
s = s.replace(marker, marker + entry, 1)
io.open(p, "w", encoding="utf-8").write(s)
PYEOF

echo "created $file"
echo "registered in data/posts.js — edit the summary, tags, and read time there"
