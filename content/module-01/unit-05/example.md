# Guided example — Follow example.com

You will follow one request to `https://example.com`, a public site kept for examples, and
collect evidence for each hop. Live sites change: your addresses, dates and some headers will
differ from the ones shown. Look for the **kind** of line, not the exact value.

**Type every command yourself.** Do not paste.

## Step 1 — The tools

```bash
mkdir -p ~/academy-labs/scratch/u1-5
```

```bash
cd ~/academy-labs/scratch/u1-5
```

```bash
dig -v
```

Expected: `DiG 9.…`. If the command is not found: `sudo apt install dnsutils`.

## Step 2 — DNS

```bash
dig +short example.com
```

Expected: one or more addresses, such as `23.192.228.80`.

```bash
dig example.com
```

Find the `;; ANSWER SECTION:`. Each line there reads: name, TTL in seconds, `IN`, record
type, address. Write the TTL down. Run `dig example.com` again after a minute: when your
resolver answers from its cache, the TTL is smaller. It counts down.

## Step 3 — The headers

```bash
curl -sI https://example.com
```

Expected: a first line such as `HTTP/2 200`, then headers, one per line. Find
`content-type`, `date` and one header that names who answered (`server`, or a header that
starts with `cf-` or `x-`). Name three headers and what each says.

## Step 4 — The whole conversation

```bash
curl -v https://example.com -o /dev/null
```

`-o /dev/null` throws the page away, so you see only the conversation. Find the line for each
hop:

| Hop | Look for a line like |
| :--- | :--- |
| DNS | `Host example.com:443 was resolved.` and the addresses |
| TCP | `Connected to example.com (23.192.228.80) port 443` |
| TLS | `SSL connection using TLSv1.3` and `subject: CN=…` |
| HTTP request | `> GET / HTTP/2` |
| HTTP response | `< HTTP/2 200` |

Lines that start with `>` were sent. Lines with `<` were received. Lines with `*` are `curl`
explaining what it does.

## Step 5 — The certificate

```bash
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

Expected: four lines that start with `subject=`, `issuer=`, `notBefore=` and `notAfter=`.
Which names does the subject cover? Who signed it? How many days until `notAfter`?

Stop here if you are between Part A and Part B of the lesson.

## Step 6 — Without TLS

```bash
curl -sI http://example.com
```

There is no `s` in `http`. Compare with step 3. Some sites answer on port 80 with a `301` or
`308` and a `location: https://…` header, to send you to the encrypted address. Others answer
the page itself. Either way, on `http` everything you send can be read on the way.

## Step 7 — The server says "not found"

```bash
curl -sI https://example.com/nothing-here
```

Expected: a status in the 4xx family, often `404`. This is good news for the earlier hops: DNS
worked, the connection worked, TLS worked, and the server answered. Only the path was wrong.

## Step 8 — The journey stops at hop 1

```bash
curl -sSI https://no-such-name.invalid; echo "exit: $?"
```

Expected: `curl: (6) Could not resolve host: no-such-name.invalid`, then `exit: 6`. There is no
address, so nothing was connected. `-S` shows errors even with `-s`.

## What you used

`dig +short` · `dig` · `curl -sI` · `curl -v` · `openssl s_client` · `openssl x509`
