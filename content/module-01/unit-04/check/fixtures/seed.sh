#!/usr/bin/env bash
# Builds the repository for project 1.4 (m1-p4) and, beside it, the debugging lab's repository.
# Run by `academy init m1-p4`. Usage: seed.sh <lab-root>
# Fixed author and dates, and no global Git settings, so every run gives the same history.
set -euo pipefail

root="${1:?lab root is required}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
debug="$(dirname "$root")/timetable"

export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME="Lab Seed" GIT_AUTHOR_EMAIL="seed@example.invalid"
export GIT_COMMITTER_NAME="Lab Seed" GIT_COMMITTER_EMAIL="seed@example.invalid"
day=0
commit() { # commit "message": one commit, one day after the last
  day=$((day + 1))
  local when; when="2026-11-0${day}T09:00:00+0000"
  GIT_AUTHOR_DATE="$when" GIT_COMMITTER_DATE="$when" git commit -q -m "$1"
}

rm -rf "$root" "$debug"
mkdir -p "$root"
cd "$root"
git init -q -b main

# main: four commits.
printf 'Term 1: 7 September 2026 to 18 December 2026\nTerm 2: 11 January 2027 to 2 April 2027\nTerm 3: 26 April 2027 to 23 July 2027\n' > terms.md
git add terms.md && commit "Add the term notes file"
printf 'Basic 1\nBasic 2\nBasic 3\n' > classes.md
git add classes.md && commit "Add the class list"

# fix/term-dates starts here, after commit 2.
git branch fix/term-dates

sed -i '1s/.*/Term 1: 14 September 2026 to 18 December 2026/' terms.md
git add terms.md && commit "Correct the Term 1 opening date"
printf '6 March: Independence Day\n1 May: May Day\n1 July: Republic Day\n' > holidays.md
git add holidays.md && commit "List the public holidays"

git switch -q fix/term-dates
sed -i '1s/.*/Term 1: 7 September 2026 to 18 December 2026 (mid-term break 26 to 30 October)/' terms.md
git add terms.md && commit "Add the mid-term break to Term 1"
sed -i '2s/.*/Term 2: 11 January 2027 to 9 April 2027/' terms.md
git add terms.md && commit "Correct the Term 2 closing date"

# Finished work on a branch that was then deleted by mistake. Only the reflog knows it.
git switch -q main
git switch -q -c feature/houses
cp "$here/houses.md" houses.md
git add houses.md && commit "Add the four houses"
git switch -q main
git branch -q -D feature/houses

# A secret lying in the folder. The value is made up, and it is built here so that
# the course repository never contains a key-shaped string.
prefix="sb_""secret_"
printf 'ADMIN_TOKEN=%sLabOnlyFakeValue0000000000\n' "$prefix" > .env

cat > TASK.md <<'MD'
# Task

1. Keep .env out of Git, for ever.
2. Merge fix/term-dates into main, with a merge commit.
3. Bring back the lost "Add the four houses" work onto main.
4. Do not rewrite or delete any commit that is already here.

Term 1 opens on 14 September 2026. The mid-term break is correct.
MD

# The debugging lab: three commits on main, then two made on a detached HEAD.
mkdir -p "$debug"
cd "$debug"
git init -q -b main
printf 'Monday: assembly\nTuesday: sports\n' > timetable.md
git add timetable.md && commit "Add the first timetable"
printf 'Wednesday: library\n' >> timetable.md
git add timetable.md && commit "Add the Wednesday library hour"
printf 'notes/\n' > .gitignore
git add .gitignore && commit "Ignore the notes folder"
git switch -q --detach HEAD~1
printf 'Friday: assembly\n' >> timetable.md
git add timetable.md && commit "Add the Friday assembly"
sed -i 's/^Tuesday: sports$/Tuesday: music/' timetable.md
printf 'Wednesday: sports\n' >> timetable.md
git add timetable.md && commit "Move sports to Wednesday"
git switch -q main
mkdir -p notes
printf '# Meeting, 13 November\n\nThe timetable changes start in Term 2.\n' > notes/meeting.md
cat > diagnosis.md <<'MD'
## Observe

## Possible causes

## Tests

## Cause

## Fix
MD
