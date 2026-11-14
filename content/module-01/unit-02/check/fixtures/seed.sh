#!/usr/bin/env bash
# Builds the log folder for project 1.2 (m1-p2) and its debugging lab.
# Run by `academy init m1-p2`. Usage: seed.sh <lab-root>
set -euo pipefail

root="${1:?lab root is required}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

rm -rf "$root"
mkdir -p "$root/debug"
cd "$root"

# The logs the report reads.
cp "$here/access.log" access.log
cp "$here/term-1-access.log" "term 1 access.log"
cp "$here/no-failures.log" no-failures.log
: > empty.log

cat > README.txt <<'TXT'
One line is one request to the school's web server. The columns, separated by spaces:
1 the client address   4-5 the date and time in [ ]   6-8 "METHOD PATH PROTOCOL"
9 the status code      10 the size of the answer in bytes
Status 200-299 means it worked, 300-399 means "go elsewhere" or "not changed".
Status 400 or more means it failed: 401 not signed in, 403 not allowed, 404 not found.
500 or more means the server itself failed.
TXT

cat > answers.md <<'MD'
## My pipeline, part by part

## Why uniq needs sort

## How I tested the awkward cases
MD

# The debugging lab: a script with two faults, and the same logs.
cp "$here/by-address.sh" debug/by-address.sh
chmod 755 debug/by-address.sh
cp "$here/access.log" debug/access.log
cp "$here/term-1-access.log" "debug/term 1 access.log"
cat > debug/diagnosis.md <<'MD'
## Observe

## Possible causes

## Tests

## Cause

## Fix
MD

echo "Lab ready: $root"
