# Debugging lab — Which hop broke?

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

Four users wrote in on the same day. Each said only: "The site is broken." Each sent what
their terminal showed. The site is `school.example` (a made-up name).

### Case A

```text
$ curl -sSI https://schol.example/
curl: (6) Could not resolve host: schol.example
```

### Case B

```text
$ curl -sSI https://www.school.example/
curl: (60) SSL: no alternative certificate subject name matches target host name 'www.school.example'
More details here: https://curl.se/docs/sslcerts.html
```

### Case C

```text
$ curl -sI https://school.example/reports
HTTP/2 502
content-type: text/plain; charset=utf-8
server: Vercel
x-vercel-error: FUNCTION_INVOCATION_TIMEOUT
x-vercel-id: lhr1::abcd1-1794600000000-0123456789ab
```

### Case D

The user says: "I changed the notice page yesterday, and it still shows the old text."

```text
$ curl -sI https://school.example/notices
HTTP/2 200
age: 86400
cache-control: public, max-age=31536000
content-type: text/html; charset=utf-8
server: Vercel
x-vercel-cache: HIT
```

## Start

There is nothing to install. Make a folder for your notes:

```bash
mkdir -p ~/academy-labs/scratch/u1-5-debug
```

```bash
cd ~/academy-labs/scratch/u1-5-debug
```

Make `diagnosis.md` with the five headings below.

## Your work

Under **each** heading, write four short entries: A, B, C and D.

| Heading | What to write for each case |
| :--- | :--- |
| `## Observe` | The one line that matters, copied exactly |
| `## Possible causes` | Three causes for that case |
| `## Tests` | The command you would run next: `dig`, `openssl s_client`, the platform's function logs, or `curl -sI` twice to compare `age` |
| `## Cause` | The hop that failed |
| `## Fix` | Who must act: the user, the domain owner, the developer — or nobody (wait, or empty the cache) |

## Fixed state

There is nothing to repair here. You are done when all four hops are named, each with its
`Observe` line as evidence.

## Who checks it

This lab is **self-reviewed**. The answer key is at the very end of `review.md`. Read it only
after your `diagnosis.md` is finished.
