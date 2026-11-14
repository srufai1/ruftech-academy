# Own build — Local against deployed

No steps and no hints this time. Build it your way, then compare.

## Requirements

1. In `~/academy-labs/scratch/u1-5-own/`, write a Node server of about ten lines that answers
   `/login` with a small HTML page and the header `cache-control: no-store`.
2. Save `curl -v http://127.0.0.1:<your port>/login` into `docs/evidence/local.txt` in
   `~/projects/gpis-rebuild`.
3. `notes/unit-1-5.md` has a table: one row for each of the seven hops, a "deployed" column and
   a "local" column, saying what is missing locally and why (no DNS, no TLS, no edge).
4. One paragraph in the same note: which bugs can therefore **never** be found on localhost?
5. Add a second route `/logo` with `cache-control: max-age=3600`. Show with two `curl -sI` runs
   how you would know whether a cache answered.

## Who checks it

This build is **self-reviewed**. Go through the five requirements one by one and run a
command that proves each.

## Then compare with GPIS

GPIS is developed on `localhost:3000` and runs on Vercel. Write in `notes/unit-1-5.md`: name
one GPIS feature that you would test again after deployment, not only on your laptop, and
say which hop is the reason.
