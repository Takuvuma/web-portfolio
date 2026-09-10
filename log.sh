#!/usr/bin/env bash
# Log a study/work session to the progress dashboard — and publish it.
#
#   ./log.sh entra 90 "Configured a conditional access policy in the lab"
#   ./log.sh cert 45 "SC-300 module 3" https://learn.microsoft.com/...
#   ./log.sh --no-push read 30 "Read the Okta SCIM docs"
#
# Logs the session, commits, and pushes so the live site updates.
# Works from any directory.

set -euo pipefail
cd "$(dirname "$0")"

push=1
if [ "${1:-}" = "--no-push" ]; then push=0; shift; fi

if [ $# -lt 3 ]; then
  echo 'usage: ./log.sh [--no-push] <category> <minutes> "<what you did>" [link]'
  echo -n 'categories: '
  grep -oE '^  [a-z]+:' data/activity.js | tr -d ' :' | tr '\n' ' '
  echo
  exit 1
fi

category=$1
minutes=$2
title=$3
link=${4:-}
date=$(date +%Y-%m-%d)

entry="  { date: \"$date\", minutes: $minutes, category: \"$category\", title: \"$title\""
[ -n "$link" ] && entry="$entry, link: \"$link\""
entry="$entry },"

awk -v e="$entry" '
  /^window\.IAM_LOG = \[/ { print; print e; next }
  { print }
' data/activity.js > data/activity.js.tmp && mv data/activity.js.tmp data/activity.js

hours=$(awk "BEGIN { printf \"%.1f\", $minutes/60 }")
echo "logged: $date · $category · ${hours}h · $title"

if [ "$push" = "1" ]; then
  git add data/activity.js
  git commit -qm "Log $date: $title"
  if git push -q 2>/dev/null; then
    echo "pushed — the dashboard updates in about a minute"
  else
    echo "committed, but the push failed. Run 'git push' from ~/Desktop/portfolio when you're back online."
  fi
fi
