# Review and mastery check

This is **self-assessed**. Nobody else checks it. Be honest; it is for you.

## Review checklist

Tick only what is true.

- [ ] `m1-p5` passes in the checker.
- [ ] I typed the commands myself. I did not paste them.
- [ ] Every hop in my journey has evidence, or a reason why there is none.
- [ ] No cookie or token is in my files.
- [ ] In the debugging lab I named the hop before I named the fix.
- [ ] I can tell a 404, a 500 and a 502 apart.

## Compare with GPIS

Write three to five sentences on the platform:

- In the read-only copy, find where the sign-in form is handled (look under `src/app/`).
  Does the browser talk to the database directly, or through the server? How can you tell?
- GPIS keeps the session in a cookie. Which of your seven hops read or write that cookie?

## Mastery check

Close the lesson. Open a new terminal. Do each task, then test yourself by running the
commands.

1. For a site you have never traced, produce DNS, TLS and header evidence in under ten
   minutes.
2. From memory, draw the seven hops and name one cache at each.
3. "`curl` works, the browser shows an error page." List three causes, most likely first.
4. Explain why a 502 is the edge's report, not the app's.

**You have mastered this unit when** you did all four without help. If not, redo the guided
example tomorrow, not today, and try again.

## Reflection (two minutes)

- What surprised me?
- What will I do differently in the next unit?

---

## Answer key for the debugging lab

Stop. Read this only after your `diagnosis.md` is finished.

| Case | Hop | The line that proves it | Who acts |
| :--- | :--- | :--- | :--- |
| A | DNS | `Could not resolve host: schol.example` — the name is misspelt | The user types the right name |
| B | TLS | `no alternative certificate subject name matches … 'www.school.example'` — the certificate does not cover the `www` name | The domain owner adds that name to the certificate, or sends `www` to the main name |
| C | App | `HTTP/2 502` with `x-vercel-error: FUNCTION_INVOCATION_TIMEOUT` — the edge answered, the app function did not in time | The developer reads the function logs |
| D | Edge cache | `x-vercel-cache: HIT`, `age: 86400` and a one-year `max-age` — the edge serves yesterday's copy | Nobody needs to repair code: empty (purge) the cache, then shorten `max-age` for pages that change |
