# Lab — Project 1.5: Request journey

**Level:** guided. **Checker:** `m1-p5`. **Time:** about 255 minutes.

You will soon build a sign-in page. First, prove you know the road a sign-in request travels,
on a real site built with the same tools you will use: Next.js, hosted on Vercel, with a
Supabase database.

**The target site** is this course's own platform:

- host: `ruftech-academy.vercel.app`
- sign-in page: `https://ruftech-academy.vercel.app/sign-in`

**The rule:** you only **load** the sign-in page (a `GET`). You do not sign in from the
terminal. You never write a password, a cookie value or a token into a file.

## Start

This is a **repo project**: there is no lab folder. You work in your own project.

```bash
cd ~/projects/gpis-rebuild
```

```bash
mkdir -p docs/evidence
```

## What "done" means

| # | Requirement |
| :--- | :--- |
| 1 | `docs/request-journey.md` has these headings, in this order: `## Browser`, `## DNS`, `## TCP and TLS`, `## Edge`, `## App server`, `## Database`, `## Response`, `## Diagram` |
| 2 | Each section has at least 40 words. Each of the first seven has one line that starts `Cache: ` saying which cache can sit there and what it would hide |
| 3 | Each of the first seven sections has one line that starts `Evidence: ` naming a file in `docs/evidence/`, or saying "none possible from outside, because …" |
| 4 | `docs/evidence/dns.txt` holds the full `dig` output for the target host |
| 5 | `docs/evidence/tls.txt` holds the certificate's subject, issuer and dates |
| 6 | `docs/evidence/headers.txt` holds the response headers of the sign-in page |
| 7 | `## Diagram` holds a Mermaid sequence diagram with at least five participants, and a sentence or two about it (40 words in all) |
| 8 | No cookie value or token is in any evidence file |

## Steps (guided)

1. You made `docs/evidence/` above.
2. Save the DNS answer: `dig ruftech-academy.vercel.app > docs/evidence/dns.txt`.
3. Save the certificate: the `openssl` pipeline from step 5 of the guided example, with the
   target host, ending in `> docs/evidence/tls.txt`.
4. Save the headers of the sign-in page with `curl -sI … > docs/evidence/headers.txt`. Open
   the file. If a line starts with `set-cookie:`, replace everything after `set-cookie: ` with
   `[removed]`.
5. Write the seven sections, one hop at a time: what happens there, the `Evidence:` line, the
   `Cache:` line.
6. For **App server** and **Database**, say what you cannot see from outside, and how you
   still know they exist (the response headers; the stack named in the course description).
7. Draw the diagram in a Mermaid block:

   ````text
   ```mermaid
   sequenceDiagram
     participant B as Browser
     participant R as DNS resolver
     B->>R: where is ruftech-academy.vercel.app?
     R-->>B: an address
   ```
   ````

   Continue it with the edge, the app and the database.
8. Run the checker.
9. Commit your work if `gpis-rebuild` is already a repository.

## Hints

- **a.** Response headers that begin with `x-vercel-`, and the `server:` header, tell you who
  answered.
- **b.** `age`, `cache-control` and `x-vercel-cache` tell you about the edge cache.
- **c.** You cannot see the database from outside. That is a finding, not a gap: write it
  down in the `Evidence:` line.

## Check your work

Inside `~/projects/gpis-rebuild`:

```bash
npx academy check m1-p5
```

Fix what fails and run it again. Every run is recorded; a failed run costs nothing.

## Compare with GPIS

GPIS uses the same three layers: Vercel, Next.js, Supabase. In your read-only copy, look in
`src/app/` for the sign-in page. Add a short `## GPIS` section at the end of your journey
document: which of your seven hops does the GPIS sign-in pass through, and is any hop
different?
