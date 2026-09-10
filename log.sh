#!/usr/bin/env bash
# Append a session to data/activity.js — run from the repo root.
#
#   ./log.sh entra 90 "Configured conditional access policy in lab"
#   ./log.sh cert 45 "SC-300 module 3" https://learn.microsoft.com/...

set -euo pipefail

if [ $# -lt 3 ]; then
  echo "usage: ./log.sh <category> <minutes> \"<title>\" [link]"
  echo "categories: entra ad okta cloud script govern genai cloudsec cert read"
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

# Insert right after the opening of window.IAM_LOG = [
awk -v e="$entry" '
  /^window\.IAM_LOG = \[/ { print; print e; next }
  { print }
' data/activity.js > data/activity.js.tmp && mv data/activity.js.tmp data/activity.js

echo "logged: $date · $category · ${minutes}m · $title"
