#!/usr/bin/env bash
# Builds the folder for project 1.3 (m1-p3) and its debugging lab.
# Run by `academy init m1-p3`. Usage: seed.sh <lab-root>
# The seed starts nothing. The learner starts every process.
set -euo pipefail

root="${1:?lab root is required}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

rm -rf "$root"
mkdir -p "$root/debug"
cd "$root"

cp "$here/server.mjs" "$here/leaky.sh" "$here/start.sh" "$here/server.conf" .
chmod 755 leaky.sh start.sh
chmod 644 server.mjs server.conf

cat > README.txt <<'TXT'
The office status server.
Start it with ./start.sh.
The server must answer on 127.0.0.1 port 8080 at /health.
TXT

cat > evidence.md <<'MD'
## Process tree

## Listening sockets

## Signals I sent

## What was wrong
MD

# The debugging lab.
cp "$here/app.mjs" "$here/old-app.mjs" "$here/run.sh" "$here/stop.sh" "$here/setup.sh" debug/
chmod 755 debug/run.sh debug/stop.sh debug/setup.sh
chmod 644 debug/app.mjs debug/old-app.mjs
cat > debug/diagnosis.md <<'MD'
## Observe

## Possible causes

## Tests

## Cause

## Fix
MD
