#!/usr/bin/env bash
# Starts the office status server and its helper in the background.
set -euo pipefail
cd "$(dirname "$0")"
if [ -f server.pid ] && kill -0 "$(cat server.pid)" 2>/dev/null; then
  echo "already running (PID $(cat server.pid))" >&2
  exit 1
fi
nohup ./leaky.sh > /dev/null 2>&1 &
nohup node server.mjs > server.out 2>&1 &
echo "started"
