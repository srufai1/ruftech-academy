# How the web works: one request's journey

This lesson has two parts. Part A follows a request from your laptop to a server. Part B
follows it inside the platform and back.

## Part A

## A1. Clients and servers

A **client** (your browser, or `curl`) sends a **request**. A **server** sends back a
**response**. Every page you see is the end of this conversation, often repeated many times.

A URL has parts:

```text
https://ruftech-academy.vercel.app:443/sign-in?next=/learn
└─┬──┘   └──────────┬────────────┘ └┬┘ └──┬──┘ └───┬────┘
scheme            host            port  path    query
```

The port is usually not written: `https` means 443, `http` means 80.

## A2. Finding the server: DNS

Computers connect to **addresses** such as `76.76.21.21`, not to names. **DNS** turns a name
into an address. Your laptop asks a **resolver** (usually your internet provider's), which
finds the answer and remembers it.

- An **A** record gives an IPv4 address; **AAAA** an IPv6 address; **CNAME** says "this
  name is another name, ask for that one".
- Every answer has a **TTL** (time to live): how many seconds it may be remembered.

`dig +short host` prints only the addresses. `dig host` prints the whole answer, with the
`ANSWER SECTION` and the TTL.

## A3. Connecting: TCP

With the address, your laptop opens a **TCP connection** to the address and port. The two
sides exchange three small packets (the handshake) to agree to talk. If nothing listens on
that port, the connection is refused, as you saw in unit 1.3.

## A4. Trusting: TLS

On `https`, the next step is **TLS**. The server shows a **certificate**: which names it
covers, who signed it (the **issuer**), and when it is valid (`notBefore`, `notAfter`). Your
laptop checks all three. Then both sides agree on keys, and everything after is encrypted.

What HTTPS protects: the path, the headers, the body — so passwords and cookies. What it does
**not** hide: which address you connect to, and the host name (DNS and TLS both show it).

```bash
openssl s_client -connect host:443 -servername host </dev/null
```

prints the certificate. `openssl x509 -noout -subject -issuer -dates` keeps the four lines
that matter.

## A5. Speaking: HTTP

Inside the connection the client sends a request: a **method** (`GET` to read, `POST` to
send a form), a path, and **headers**. The server answers with a **status**, headers and a
body.

| Status | Meaning | Example |
| :--- | :--- | :--- |
| 2xx | It worked | `200 OK` |
| 3xx | Go elsewhere; the `location` header says where | `302` to `/sign-in` |
| 4xx | The request was wrong | `401` not signed in, `404` not found |
| 5xx | The server failed | `500` the app failed, `502` the app gave no valid answer |

Headers to know: `content-type` (what the body is), `set-cookie` (store this), `cache-control`
(how long it may be kept), `location` (where to go). `curl -sI url` prints only the status and
headers. `curl -v url` prints the whole conversation.

Stop here. Do steps 1–5 of the guided example. Then read Part B.

## Part B

## B1. The edge

A hosting platform such as Vercel answers first, from a server near you: the **edge**. TLS
ends there. Files that are the same for everyone (images, CSS, some pages) come from its cache.
Everything else is passed to a **function** that runs the app.

## B2. The app

The Next.js server builds the page or runs an action. It reads the session **cookie** to know
who you are.

## B3. The database

The app asks Supabase (PostgreSQL) for the data over the network. The browser never talks to
it in this design. The database decides which rows this user may see.

## B4. Back to the browser

The browser receives HTML, then asks for the CSS, JavaScript and images it names — more
requests, each with the same journey. It stores cookies, draws the page, and keeps a copy in
its own cache.

```text
Browser ──1 DNS──▶ resolver           cache? DNS answers are kept for the TTL
Browser ──2 TCP + 3 TLS──▶ edge       cache? the edge may answer from its cache
edge ──4──▶ app function              cache? the app may keep data it fetched
app ──5──▶ database                   (no cache: the source of truth)
database ──6──▶ app ──7──▶ edge ──▶ browser   cache? the browser keeps a copy
```

## B5. Caches at every hop

A cache saves time, and a stale cache hides a change. When "nothing changed", ask which cache
answered.

| Cache | How you see it |
| :--- | :--- |
| Browser | `curl` shows the new page, the browser the old one |
| DNS | The TTL in `dig` |
| Edge | Headers such as `age`, `cache-control`, `x-vercel-cache: HIT` |
| App data | Only the developer sees it, in the code and logs |

## B6. In GPIS

GPIS signs in with a `POST` handled on the server. The session lives in a cookie. Pages with
a student's private data are built for each request and never stored in a shared edge cache:
the next visitor must never receive someone else's page.

## Common mistakes

1. "The site is down" for every error → no hop is named → read the exact message: resolve,
   connect, certificate, status.
2. Testing only in the browser → its cache hides the change → repeat with `curl`.
3. Mixing up 502 and 500 → 502: the edge got no valid answer from the app; 500: the app
   answered with a failure.
4. Thinking HTTPS hides the host name → it does not; it hides path, headers and body.
5. Pasting cookies or tokens into evidence files → a session is leaked → cut them out and
   write `[removed]`.

## Words to remember

client · server · URL · DNS · resolver · TTL · TCP · TLS · certificate · issuer · method ·
status · header · edge · function · cookie · cache
