#!/usr/bin/env bash
# Starts a helper every 2 seconds. It never waits for them.
while true; do
  sleep 6001 &
  sleep 2
done
