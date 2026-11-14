#!/usr/bin/env bash
# Prints how many failed requests (status 400 or more) each client address made.
# Usage: ./by-address.sh FILE
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "usage: by-address.sh FILE" >&2
  exit 1
fi

awk '$9 >= 400 {print $1}' $1 | uniq -c | sort -nr
