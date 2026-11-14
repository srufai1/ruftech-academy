#!/usr/bin/env bash
# Starts the app in the background and says whether it is running.
cd "$(dirname "$0")"
nohup node app.mjs > app.out 2>&1 &
sleep 1
if kill -0 "$!" 2>/dev/null; then
  echo "running"
else
  cat app.out >&2
  exit 1
fi
