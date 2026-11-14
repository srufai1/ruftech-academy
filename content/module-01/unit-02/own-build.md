# Own build — Top pages

No steps and no hints this time. Build it your way, then compare.

Work in `~/projects/gpis-rebuild`.

## Requirements

1. `scripts/top-pages.sh FILE [N]` prints the N most requested paths among **successful**
   requests (status 200 to 399), as `COUNT PATH`, biggest first, equal counts in path order.
   N is 3 when it is not given.
2. If N is not a whole number above 0, the script prints a usage line on standard error and
   exits 1.
3. A missing or unreadable file: exit 2. A file with no successful request: prints
   `no requests` and exits 0.
4. It works on a file name with spaces.
5. `docs/commands.md` gains five commands from this unit, each with your own one-line meaning.
6. `notes/unit-1-2.md` lists the three inputs you tested with, and what each one proved.

You can test it on the logs in `~/academy-labs/m1-p2/logs`. Copy them; do not change them.

## Who checks it

This build is **self-reviewed**. Go through the six requirements one by one and run a
command that proves each.

## Then compare with GPIS

GPIS scripts are run by CI, many times a day, with nobody watching. Pick one script in
`scripts/` of your read-only copy. Write in `notes/unit-1-2.md`: what input does it expect,
and what does it do when the input is wrong?
