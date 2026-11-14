#!/usr/bin/env bash
# Stops the app.
cd "$(dirname "$0")"
kill "$(cat app.pid)" 2>/dev/null
echo "stopped"
