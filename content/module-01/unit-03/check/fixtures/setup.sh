#!/usr/bin/env bash
# Run this once before the debugging lab. It sets the scene; do not read it first.
cd "$(dirname "$0")"
nohup node old-app.mjs > /dev/null 2>&1 &
sleep 0 &
gone=$!
wait "$gone"
echo "$gone" > app.pid
echo "ready: now run ./run.sh"
