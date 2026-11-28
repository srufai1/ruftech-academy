# Module 3 — Frontend with Next.js

Read `00-guide.md` first. Level: **guided** for 3.1–3.3, **half guided** for 3.4–3.6.
8 weeks, about 104 hours.

| Unit | Title | Project | Kind | Level | Minutes | Check steps |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 3.1 | HTML, CSS and a first Next.js site | `m3-p1` Portfolio site | Repo (`~/projects/portfolio`) | guided | 780–1140 | 11 |
| 3.2 | Layouts, navigation and components | `m3-p2` App shell | Repo | guided | 810–1230 | 13 |
| 3.3 | Server Components and the URL as state | `m3-p3` Students list | Repo | guided | 870–1290 | 12 |
| 3.4 | Dynamic routes and tabs | `m3-p4` Student profile | Repo | half | 780–1140 | 10 |
| 3.5 | Client Components and forms | `m3-p5` Score entry screen | Repo | half | 960–1440 | 11 |
| 3.6 | Printing | `m3-p6` Print layer | Repo | half | 810–1230 | 10 |

## Module rules (decided here)

| Topic | Rule |
| :--- | :--- |
| Next.js version | The version `create-next-app` installs when the unit is built (16 at the time of design). **Before writing any lesson or check, the builder reads the guides in `node_modules/next/dist/docs/`** for: `searchParams` and `params` in pages, `Link`, `layout`, `error` / `loading` / `not-found` files, `"use client"`. API details in this file are named by idea, not by signature |
| Ports | `school-system` runs on `http://localhost:3000` (`npm run dev`). The portfolio runs on `http://localhost:3001` (`"dev": "next dev -p 3001"`), so the two can never be confused |
| The learner starts the app | Every `lab.md` in this module says: "In a second terminal: `npm run dev`. Leave it running while you check." The checker starts nothing |
| Styling | Tailwind CSS v4 and shadcn/ui (Radix, Lucide icons) only, as GPIS. No second component library, no CSS-in-JS |
| Design target | 360px wide first; 44px touch targets; tables become cards below `md:`; nothing hidden on phones (GPIS interface rules) |
| Data | No database yet. `src/data/sample.ts` holds the sample data (below), typed with unit 2.6's types. Pages read it through functions in `src/lib/sample-queries.ts`, so module 5 can swap the source without touching pages |
| State in the address | Search, filters, page number, tab and score part live in the URL, as in GPIS. This also makes them checkable (guide 10.5) |
| HTML checks | Where a fact is in the server's HTML (a link's address, `aria-current`, `lang`, a label), a `tests` step with `files:` fetches the page with Node's `fetch` and reads the HTML. Its first assertion is "the app answers at http://localhost:3000". No browser needed |
| Browser checks | Use T26 `page.actions` and role, label or test ID targets. Use `media: print` for print rendering after T35. |
| Browser setup | Once, install Playwright with `npm install -D playwright` and `npx playwright install chromium`. Run `npx academy doctor` to prove Chromium starts. |
| `src/config/school.ts` | In 3.2 `src/config/school.mjs` becomes `school.ts` (same export, more fields). `scripts/school-info.mjs` imports the `.ts` file |

## Sample data contract (`src/data/sample.ts`)

`lab.md` of unit 3.3 prints this file in full; the learner copies it in. The check compares
it with `fixtures/sample.ts` by hash, so later checks can rely on exact names and counts.
The builder writes the 24 students; these facts are fixed:

| Fact | Value |
| :--- | :--- |
| Academic years | `2025/2026` (ended) and `2026/2027` (current), three terms each (the sample term dates of unit 2.4 for 2026/2027) |
| Classes (`id`, `name`, `slug`) | 1 Basic 3 `basic-3`; 2 Basic 4 `basic-4`; 3 JHS 2 `jhs-2`; 4 JHS 3 `jhs-3` |
| Students | 24, ids 1–24, each with `code` `ADM/GPIS/YYYY/NNN` (D-48 shape), names, date of birth, gender, guardian phone, status |
| Statuses | 20 `active`, 3 `withdrawn` (each with an ended membership), 1 `alumni` |
| Active on roll now | Basic 3: 7 · Basic 4: 6 · JHS 2: 4 · JHS 3: 3 |
| Fixed people | 1 Godfred Kofi Asante (Basic 3, active) · 2 Ama Serwaa Birikran (Basic 3, active; was in Basic 2 in 2025/2026 — a class with no current roll, id 5, `basic-2`) · 3 Esi Kyei (JHS 3, active) · 4 Abena Asante (Basic 4, active) · 5 Kofi Mensah (withdrawn 6 November 2026; was JHS 2) · 6 Yaw Owusu (alumni; was JHS 3 in 2025/2026) |
| Name search facts | `asante` matches exactly students 1 and 4. `a` matches more than 10 active students. `zzz` matches nobody. No other student has "Kyei" or "Birikran" |
| Order | Last name, then first name (A to Z). First active student in that order is student 4, Abena Asante; then student 1 |
| Subjects of Basic 3 | English Language, Mathematics, Science, Our World Our People, Creative Arts, Twi (ids 1–6, slugs like `mathematics`) |
| Draft marks | None in the file. Score entry starts empty |

## GPIS rules used in this module

| Rule | Text to use |
| :--- | :--- |
| GPIS AGENTS.md, "Interface rules" | Mobile-first means 360px is the design target. Touch targets minimum 44×44px. Tables become cards below `md:`. Never solve a layout problem by removing functionality on small screens |
| **D-254** | Phones have no hamburger. Every role has one bottom bar: its main places, then **More**, which opens the full menu. Account and Sign out stay in the photo menu at the top. Computers keep the sidebar only. Admin's bar: Home · Students · Scores · Classes · More |
| **D-247** | Name search: words in any order; full stops ignored |
| **D-04** | A class list covers students with an open membership for that class and term **and** status `active` |
| **D-76** (named only) | A historical roster deliberately shows withdrawn and alumni students whose membership covered the period |
| **D-21** | The class shown for a past term comes from the membership of that term, never from "today" |
| **D-162 / D-10** | Parts and maxima: Individual Test 15, Class Test 15, Group Work 15, Project Work 15, Examination 100. Zero, blank and `ABS` are different. A blank is never counted as 0 |
| **D-257** | Score entry: part chips show each maximum ("Ind Test 15 · Group Work 15 · Project Work 15 · Exam 100"); a dashed, locked "Class test auto" chip; **one bottom button**, in this order of priority: "N marks to fix ↑" (jumps to the first wrong mark), "Next: <part> ›" while more parts follow, "Submit <subject>" on the last part. Every mark autosaves; the "✓ Saved" tick never says "Saving…". Submit asks once: "Blank marks stay blank. They are not counted as 0." |
| **D-07** | Printing is portrait only: A4 portrait, browser-native, no server-side PDF library |
| **D-33** | Every printable document shares one print layer (header, logo placement, margins, school details, print styling), built **before** any document |
| **D-34** (named only) | The ID card sheet is the one exception to "one document per page" |
| GPIS AGENTS.md | School details come from one config module; no hard-coded "Great Pakyiman" strings in components |

---

## Unit 3.1 — HTML, CSS and a first Next.js site

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m3-u1` / `m3-p1` |
| title | HTML, CSS and a first Next.js site |
| module / position | 3 / 1 |
| guidance | guided |
| minutes | `{ min: 780, max: 1140 }` |
| gpis_part | The login page and public pages of GPIS: plain, accessible HTML that works at 360px |
| requires | `[wsl, node, git, github, vercel, playwright]` |

### Outcomes

After this unit you can:

1. write a page with meaningful HTML: headings in order, landmarks, links, lists, images with text alternatives;
2. lay a page out for a 360px phone first and widen it with Tailwind breakpoints;
3. create a Next.js project, add pages and a shared layout, and link between them;
4. check a page with the keyboard only, and fix what cannot be reached;
5. deploy the site to Vercel and say what a deployment is.

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a noticeboard that fits on a small wall; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://nextjs.org/docs/app) (read · 10 min). Teach every quiz concept before the quiz.


| § | Section | Key ideas |
| :--- | :--- | :--- |
| 1 | HTML says what things are | `header`, `nav`, `main`, `footer`, `h1`–`h3` in order, `p`, `ul`, `a`, `img alt`, `button` against `a` |
| 2 | CSS says how they look | Selectors, the box model, `rem`, colour contrast |
| 3 | Layout | Flow, flexbox, grid; `gap`; `max-width` for reading; never a fixed pixel width on a container |
| 4 | Phone first | Write for 360px; add `sm:` / `md:` / `lg:` for wider; test by narrowing the window; sideways scroll is a bug |
| 5 | Tailwind | Utility classes instead of a CSS file; `className`; spacing scale; `md:grid-cols-2`; `min-h-11` (44px) |
| 6 | A Next.js project | `create-next-app` (TypeScript, Tailwind, App Router, `src/`); what each folder is |
| 7 | Routes are folders | `src/app/page.tsx`, `src/app/projects/page.tsx`; `layout.tsx` wraps every page; `Link` |
| 8 | Components | A function that returns HTML-like JSX; props; one component per file; `{}` for values; `map` with `key` |
| 9 | Metadata and language | `metadata.title`, `lang="en"`, one `h1` per page |
| 10 | Accessibility by keyboard | Tab order, visible focus, a "Skip to content" link, link text that says where it goes |
| 11 | Deploying | Push to GitHub; import in Vercel; every push to `main` makes a deployment; the URL; preview deployments |

- **Diagram:** a 360px page as boxes: header / nav / main / footer, and the same page at 1024px with the nav beside the title.
- **Common mistakes**
  1. `div` for everything → a screen reader hears nothing useful → use the element that says what it is.
  2. A fixed `width: 800px` → sideways scroll on a phone → `max-w-…` and `w-full`.
  3. "Click here" links → no meaning out of context → say the destination.
  4. Removing the focus outline → keyboard users are lost → keep or restyle it.
  5. Designing on a wide screen and "fixing mobile later" → the phone layout is a pile of exceptions → start at 360px.

### Guided example — "A class notice page"

Folder `~/academy-labs/scratch/u3-1/notice/` (a Next.js app made in the example).

1. `npx create-next-app@latest notice` with the options above; `npm run dev`; open it.
2. Replace `page.tsx` with a notice: `h1`, two paragraphs, a list of three dates.
3. Open the browser's device toolbar at 360px. Add padding and a readable `max-w`.
4. Add a wide table of events on purpose; see the sideways scroll; turn it into stacked cards below `md:`.
5. Add `layout.tsx` content: header with the site name, footer; a second page `/contact`; `Link` between them.
6. Put the mouse away: Tab through the page. Add a skip link as the first element.
7. Make a `NoticeCard` component with props; render three from an array.
8. `npm run build`; read the output table of routes.

What you just used: semantic HTML, Tailwind utilities, breakpoints, routes, layout, `Link`, a component with props.

### Quiz plan (`m3-u1-quiz`, 7 questions, pass mark 5)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Which element for the main navigation links? | `<nav>` | `<div class="nav">` (looks the same, says nothing); `<menu>`; `<header>` (may contain the nav, is not the nav) |
| 2 | Predict: `class="grid grid-cols-1 md:grid-cols-3"` at 360px | One column | Three columns (reads `md:` as "mobile"); two; no grid at all |
| 3 | Find the mistake: `<img src="/me.jpg">` | No `alt` text | "`src` must be a full URL"; "`img` needs a closing tag in HTML"; "Nothing is wrong" |
| 4 | GPIS: minimum size of something you tap | 44 × 44 px | 24 px (icon size, not target size); 16 px; "any size if the text is readable" |
| 5 | A page scrolls sideways at 360px. Most likely cause? | An element with a fixed width or content that cannot wrap | "The phone is too small"; "Tailwind is not loaded" (then nothing would be styled); "Too many headings" |
| 6 | Where does content shared by every page go? | `src/app/layout.tsx` | In every `page.tsx` (repeated, and drifts); in `globals.css`; in `next.config` |
| 7 | When should you use `<button>` and not `<a>`? | When it does something on this page; a link goes somewhere | "Always a button, it looks better"; "A link if it has an icon"; "They are the same" |

### Lab — project 3.1 Portfolio site (repo project, `~/projects/portfolio`)

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give the command or file and an inline hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | A Next.js app in `~/projects/portfolio`, a Git repository, dev server on port 3001 | `project-files`, `history` |
| 2 | Pages: `/` (about you), `/projects` (at least the `school-system` project with one paragraph), `/writing` (a list; one entry is enough) | `home`, `projects`, `writing` |
| 3 | Each page: one `h1`; a title that contains your site name; `lang="en"`; a `nav` with links to all three pages; a `main`; a `footer` | `structure` |
| 4 | At 360px no page scrolls sideways; every link and button in the nav is at least 44px high | `home`, `projects`, `writing` |
| 5 | The first focusable element is a link "Skip to content" that goes to `#main` | `structure` |
| 6 | Every image has an `alt` | `structure` |
| 7 | The link for the current page is marked with `aria-current="page"` | `structure` |
| 8 | Lint, type check and build pass | `static` |
| 9 | The site is deployed on Vercel; `deploy-url.txt` holds its `https://` address on one line, and the address answers | `deploy-url`, owner review |
| 10 | `README.md` says how to run it and where it is deployed | `readme` |

**Steps (guided):** (1) `create-next-app`, set port 3001, first commit; (2) the layout:
header, nav, main, footer, skip link; (3) the home page at 360px; (4) widen at `md:`;
(5) `/projects` with a `ProjectCard` component and an array; (6) `/writing`;
(7) `aria-current` (the nav becomes a small Client Component that reads the current path —
the first `"use client"`; the lesson explains only that it is needed to know the current
address); (8) keyboard walk; (9) push to GitHub, import in Vercel, write `deploy-url.txt`;
(10) README; run the checker with the dev server running.

**Hints:** (a) `min-h-11` is 44px. (b) The browser's device toolbar has a "responsive" mode;
set the width to 360. (c) Vercel shows the address on the project page after the first
deployment.

**Finished state:** `src/app/{layout,page}.tsx`, `src/app/projects/page.tsx`,
`src/app/writing/page.tsx`, `src/components/…`, `deploy-url.txt`, `README.md`.

### Debugging lab — "It looks fine on my laptop"

| Item | Design |
| :--- | :--- |
| Seeded | A one-page Next.js-free static site (`index.html` + `styles.css`, served by `npx serve` or `python3 -m http.server 8088`) for a school open day |
| Symptom | "On my phone the page slides left and right, and I cannot press 'Register'." Then: "With the keyboard I can never reach the Register link." |
| Fault 1 | `.container { width: 960px }` and a table with `white-space: nowrap` |
| Fault 2 | "Register" is a `<div onclick>` 20px high (not focusable, too small) |
| Evidence | Observe at 360px: which element is wider than the screen (browser inspector: hover each child of `body`). Causes: image too wide; fixed container; long word. Tests: remove one rule at a time in the inspector. Fix 1: `max-width` + let the table wrap or stack. Fix 2: a real `<a>` with padding to 44px |
| Fixed state | No sideways scroll at 360px; Register reachable by Tab and ≥ 44px high; two CSS rules and one element changed, nothing else |

### Own build — a page for someone else

1. Add `/now` to your portfolio: what you are learning this month, as a list with dates.
2. Add a light / dark colour pair using CSS variables; both pass a contrast check (name the tool you used).
3. One image, optimised (`next/image`), with a useful `alt`.
4. At 360px, 768px and 1280px the page is laid out differently on purpose; describe the three in `notes/unit-3-1.md` (in `school-system`).
5. Deployed; the address in `deploy-url.txt` still answers.

### Review

- **Checklist extras:** I walked every page with the keyboard only. I looked at every page at 360px. One `h1` per page. The deployed site matches my local one.
- **Compare with GPIS:** (1) Open `src/app/login/` in the read-only copy. Which HTML elements does the form use, and how is each input labelled? (2) Find `min-h-11` or `h-11` in GPIS's components. Why does the same number keep appearing? (3) GPIS has no "mobile version". How does one set of pages serve both a phone and a computer?
- **Mastery:** (1) From an empty folder: a two-page site with a shared layout, skip link and nav, in 40 minutes. (2) Given a screenshot of a wide table, sketch its phone form. (3) Explain `md:` to someone who thinks it means "medium phones". (4) Name five things you check with the keyboard.

**Debugging-lab check** (`m3-p1-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m3-p1-own`). Open /now on the phone viewport and inspect the dated entries. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m3-p1`, version 1.0.0, no `lab:`, run in `~/projects/portfolio`, `requires [wsl, node, git, vercel, playwright]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `project-files` | files | yes | `package.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/app/writing/page.tsx`, `deploy-url.txt`, `README.md` |
| `readme` | doc | yes | `README.md`: `## How to run`, `## Where it is deployed`; `min_words_per_heading: 15` |
| `history` | git | yes | `min_commits: 6`, `message_min_chars: 15`, `no_secrets: true` |
| `structure` | tests (files) | yes | Fetches `/`, `/projects`, `/writing` on port 3001 and reads the HTML: `<html lang="en">`; exactly one `<h1>`; a `<nav>` with links to `/`, `/projects`, `/writing`; `<main id="main">`; a `<footer>`; the first `<a>` in `<body>` has `href="#main"`; every `<img>` has a non-empty `alt` or `alt=""` with `role="presentation"`; exactly one link in the nav has `aria-current="page"` and it is the current page |
| `deploy-url` | tests (run) | yes | `grep -cE '^https://[a-z0-9.-]+/?$' deploy-url.txt` → `"1\n"` |
| `static` | static | yes | `run: [lint, tsc, build]` |
| `home` | page | yes | `url: http://localhost:3001/`, status 200, `no_sideways_scroll`, `min_target_px: 44`, `text: ["Skip to content"]` |
| `projects` | page | yes | `http://localhost:3001/projects`, same, `text: ["school-system"]` |
| `writing` | page | yes | `http://localhost:3001/writing`, same |

Messages: `project-files` "A required file is missing." `readme` "README.md is missing a
heading, or a section is too short." `history` "Too few commits, a message that says too
little, or a secret." `structure` "A page is missing part of its structure: language, one
h1, nav, main, footer, skip link, alt text or the current-page mark." `deploy-url`
"deploy-url.txt must hold one https address on one line." `deployed-answers` "The address
in deploy-url.txt did not answer with status 200." `static` "Lint, the type check or the
build reports problems." `home` / `projects` / `writing` "The page does not load on port
3001, scrolls sideways at 360px, has a tap target under 44px, or is missing expected text."

### Needs

Module 2. A GitHub account (from 1.6's own build) and a free Vercel account. **Network: yes.**
Playwright's Chromium for the `page` steps (Q7). Submit the HTTPS address and a short note on the project page. The owner opens the synthetic demo and records a verdict.

---

## Unit 3.2 — Layouts, navigation and components

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m3-u2` / `m3-p2` |
| title | Layouts, navigation and components |
| module / position | 3 / 2 |
| guidance | guided |
| minutes | `{ min: 810, max: 1230 }` |
| gpis_part | The GPIS app shell: sidebar on computers, one bottom bar plus More on phones (D-254) |
| requires | `[wsl, node, git, playwright]` |

### Outcomes

After this unit you can:

1. add Next.js, Tailwind and shadcn/ui to an existing repository without breaking its tests;
2. build a layout that wraps every page and shows a different navigation on phones and computers;
3. describe navigation as data (one list) and draw two menus from it;
4. mark the current place for sighted and non-sighted users;
5. build a form page with labelled inputs (the login page, no sign-in yet).

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with the same corridor signs outside every classroom; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://nextjs.org/docs/app) (read · 10 min). Teach every quiz concept before the quiz.


| § | Section | Key ideas |
| :--- | :--- | :--- |
| 1 | Adding a framework to a living repository | Install `next`, `react`, `react-dom`, TypeScript types; `src/app/`; scripts `dev`, `build`, `start`; keep `test`, `lint`, `typecheck`, `verify`; ESLint config for Next |
| 2 | Nested layouts and route groups | `(app)/layout.tsx` for pages with the shell; `/login` outside it |
| 3 | Navigation as data | `src/lib/navigation.ts`: `{ label, href, icon, inBottomBar }[]`; one source, two drawings |
| 4 | Two shapes, one page | Sidebar `hidden md:flex`; bottom bar `md:hidden`, fixed to the bottom; content padding so the bar hides nothing |
| 5 | The More page | The bar holds four places and More; More lists every place. Nothing is unreachable on a phone |
| 6 | shadcn/ui | Components are copied into `src/components/ui/`; `Button`, `Input`, `Label`, `Card`; Lucide icons with text labels |
| 7 | The current place | `aria-current="page"`, a visible style, matching `/students/12` to "Students" |
| 8 | Forms | `label` + `htmlFor`, `name`, `type`, `autocomplete`, `required`; errors beside the field |
| 9 | The config module grows | `school.ts`: `name`, `shortName`, `motto`, `addressLines`, `phone`, `logoPath`; used by the header and the login page |
| 10 | In GPIS | `src/components/app-shell.tsx` and `bottomNav()`; no hamburger on phones; Account and Sign out in the photo menu (D-254) |

- **Diagram:** two wireframes side by side: 360px (top bar, content, bottom bar with five items) and 1280px (sidebar, content).
- **Common mistakes**
  1. Two hand-written menus → a page is added to one and forgotten in the other → one list.
  2. A fixed bottom bar with no bottom padding on the content → the last row is covered → pad the content.
  3. Icons with no text → nobody knows what they mean → icon plus label, always.
  4. Hiding a page on phones because the bar is full → a teacher on a phone cannot reach it → More.
  5. Marking the current link only with colour → invisible to a screen reader → `aria-current`.

### Guided example — "A club site with two menus"

Folder `~/academy-labs/scratch/u3-2/club/`.

1. A new Next.js app; `src/lib/nav.ts` with five places.
2. `layout.tsx` draws a top bar on wide screens from the list.
3. Add a bottom bar for narrow screens from the same list; hide each at the other size.
4. Add a sixth place: it appears in both. Then limit the bar to four + "More" and build `/more`.
5. `npx shadcn@latest init`; add `Button`; replace one link style.
6. Current place: a small Client Component with the path hook; `aria-current`.
7. A contact form page with three labelled inputs; Tab through it.
8. Measure the bar's buttons in the inspector: 44px or more.

What you just used: route groups, a nav list, responsive show / hide, shadcn/ui, `aria-current`, labelled inputs.

### Quiz plan (`m3-u2-quiz`, 7 questions, pass mark 5)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | GPIS D-254: what does a phone user see for navigation? | One bottom bar: main places, then More | A hamburger menu at the top (removed by D-254); both a hamburger and a bottom bar (the duplicate the decision removed); a sidebar that slides in |
| 2 | GPIS D-254: the Admin's bottom bar | Home · Students · Scores · Classes · More | Home · Students · Scores · Settings · More (Settings lives in More); Home · People · Scores · Finance · More (that is Root's); Home · Scores · Students · More (the Assessment team's) |
| 3 | Predict: `className="hidden md:flex"` at 360px | Not shown | Shown as flex (reads `md:` as "up to medium"); shown but empty; an error |
| 4 | Where is Sign out on a phone in GPIS? | In the photo menu at the top | In the bottom bar (the bar holds places); in More only; at the bottom of every page |
| 5 | Find the mistake: the bottom bar is `fixed bottom-0`; the last student on the list cannot be seen | The content needs bottom padding equal to the bar's height | "`fixed` is not allowed on phones"; "The list is too long"; "The bar must be at the top" |
| 6 | Why describe navigation as one list of data? | Both menus are drawn from it, so they cannot disagree | "It is faster to render"; "Next.js requires it"; "So that icons can be hidden" |
| 7 | An input has placeholder text "Username" and no label. What is wrong? | The placeholder disappears when typing and is not a label for assistive technology | "Nothing: placeholders are labels"; "Placeholders are not allowed"; "It needs `required`" |

### Lab — project 3.2 App shell (repo project)

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give the command or file and an inline hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `school-system` is a Next.js app (App Router, `src/app/`); `npm run dev` serves port 3000; `npm test` still passes; `verify.sh` runs lint, typecheck, tests and build | `project-files`, `old-tests`, `static` |
| 2 | `src/config/school.ts` exports `school` with `name`, `shortName`, `motto`, `addressLines`, `phone`, `logoPath`; `school.mjs` is gone; the school's name is typed in no other file under `src/` | `one-source`, `school-info` |
| 3 | `src/lib/navigation.ts` exports `navigation`: Home `/`, Students `/students`, Scores `/scores`, Classes `/classes`, Settings `/settings`; and `bottomBar`: the first four, then More `/more` | `nav-data` |
| 4 | Pages exist (a heading and one sentence each for now): `/`, `/students`, `/scores`, `/classes`, `/settings`, `/more`, `/login` | `pages-answer` |
| 5 | At 360px: a bottom bar with exactly Home, Students, Scores, Classes, More, each at least 44px high; no hamburger button; no sideways scroll | `phone-home`, `phone-students` |
| 6 | `/more` lists every place in `navigation` as a link | `more-page` |
| 7 | At 768px and wider the sidebar shows every place and the bottom bar is not shown | `shell-html` (classes), self-review at 1280px |
| 8 | The current place has `aria-current="page"` in both menus; `/students/anything` still marks Students | `shell-html` |
| 9 | The top bar shows the school's short name from the config module, and an account button (photo menu) containing a "Sign out" item (it does nothing yet) | `shell-html` |
| 10 | `/login` is outside the shell: school name and motto from config, a form with labelled Username and Password inputs and a "Sign in" button; no bottom bar | `login-page`, `login-html` |

**Steps (guided):** (1) branch `feature/next`; install Next and React; add `src/app/layout.tsx`
and a first page; scripts; run old tests; (2) Tailwind v4; (3) `school.ts`; fix
`school-info.mjs`; (4) `navigation.ts` with a test; (5) the route group and stub pages;
(6) sidebar; (7) bottom bar and content padding; (8) `/more`; (9) current place; (10) shadcn
init, `Button`, `Input`, `Label`; top bar with the account menu (`DropdownMenu`); (11) `/login`;
(12) `verify.sh`; merge to `main`.

**Hints:** (a) A route group folder name is in round brackets and is not part of the address.
(b) "Starts with" is the test for the current place; treat `/` as a special case. (c) The
bar's height and the content's bottom padding should be the same Tailwind number.

**Finished state:** `src/app/(app)/layout.tsx` + six pages; `src/app/login/page.tsx`;
`src/components/app-shell.tsx`, `sidebar.tsx`, `bottom-bar.tsx`, `account-menu.tsx`;
`src/components/ui/*`; `src/lib/navigation.ts`; `src/config/school.ts`.

### Debugging lab — "The last row"

| Item | Design |
| :--- | :--- |
| Seeded | A small Next.js app `shell-bug/` (the learner runs `npm install` and `npm run dev -- -p 3005`): a shell and a `/list` page with 30 rows |
| Symptom | "On my phone I cannot see or tap the last two names." Then: "On the Reports page, the bar still highlights Home." |
| Fault 1 | `main` has no bottom padding under the fixed bar |
| Fault 2 | The current-place test is `pathname === item.href`, and Home's `href` is `/`… the code was "fixed" earlier with `pathname.startsWith(item.href)`, which is true for `/` on every page, and Home is first in the list with a `break` |
| Evidence | Observe at 360px: scroll to the end; count visible rows. Causes: list cut by the data; overflow hidden; bar covers content. Tests: inspector → hide the bar; measure the bar. Fix 1: one padding class. Fault 2 tests: log `pathname` and the matched item. Fix 2: exact match for `/`, prefix for the others |
| Fixed state | Row 30 is fully visible above the bar at 360px; on `/reports/term-1` only Reports has `aria-current`; two lines changed |

### Own build — a second role's bar

1. `navigationFor(role)` in `navigation.ts` returns the list and bar for `"admin"` and `"assessment"` (D-254: Assessment team: Home · Scores · Students · More).
2. The shell reads the role from a constant in one file (`src/lib/demo-role.ts`), to be replaced by real sign-in in module 5.
3. Unit tests for both roles: every place in the list is reachable from the bar or from More.
4. A `not-found.tsx` page inside the shell with a link home.
5. `notes/unit-3-2.md`: a screenshot description of both bars and what moved.

### Review

- **Checklist extras:** both menus come from one list. Nothing is unreachable at 360px. The old unit tests still pass. I did not add a hamburger.
- **Compare with GPIS:** (1) Read `src/components/app-shell.tsx` and find `bottomNav()`. How does GPIS decide which places go in the bar for each role? (2) GPIS's sidebar is "computers only". What did phones have before D-254, and what problem did the owner describe? (3) Every GPIS page "keeps its own server gate". Why is hiding a link in the menu not a security measure?
- **Mastery:** (1) Add a new place "Reports" in under five minutes and show it in both menus. (2) Explain route groups with a drawing. (3) From memory, write a labelled input with shadcn/ui. (4) Say why a fixed bar needs padding, and how much.

**Debugging-lab check** (`m3-p2-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m3-p2-own`). Compare the two role menus in both layouts. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m3-p2`, version 1.0.0, no `lab:`, `requires [wsl, node, git, playwright]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `project-files` | files | yes | `src/app/layout.tsx`, `src/app/login/page.tsx`, `src/lib/navigation.ts`, `src/config/school.ts`, `src/components/app-shell.tsx`; `src/config/school.mjs` `absent` |
| `one-source` | tests (run) | yes | `grep -rl "Pakyiman" src \| wc -l \| tr -d ' '` → `"1\n"` |
| `school-info` | tests (run) | yes | `node scripts/school-info.mjs` → `"Great Pakyiman International School (GPIS)\n"` |
| `nav-data` | tests (files) | yes | Imports `navigation.ts`: `navigation` labels and hrefs in order; `bottomBar` is the first four + More; every `navigation` item has an `icon` |
| `old-tests` | tests (run) | yes | `npm test --silent` → exit 0 |
| `pages-answer` | tests (files) | yes | Fetch each of the seven addresses: status 200, one `<h1>` |
| `shell-html` | tests (files) | yes | Fetch `/students/anything` (expect 404 page inside the shell or 200) and `/students`: in the bottom bar and in the sidebar exactly one link has `aria-current="page"`, and it is Students; the sidebar element's class list contains `hidden` and `md:flex` (or `md:block`); the bottom bar's contains `md:hidden`; the HTML contains the school's short name and the text "Sign out" or a button with `aria-label` containing "Account" |
| `login-html` | tests (files) | yes | Fetch `/login`: `<label for=…>` matching an `<input name="username" autocomplete="username">` and an `<input name="password" type="password" autocomplete="current-password">`; a submit button "Sign in"; no element with `data-bottom-bar` |
| `phone-home` | page | yes | `http://localhost:3000/`, `text: ["Home", "Students", "Scores", "Classes", "More"]`, `no_sideways_scroll`, `min_target_px: 44` |
| `phone-students` | page | yes | `http://localhost:3000/students`, same texts and limits |
| `more-page` | page | yes | `http://localhost:3000/more`, `text: ["Settings", "Classes", "Scores", "Students", "Home"]`, `min_target_px: 44` |
| `login-page` | page | yes | `http://localhost:3000/login`, `text: ["Great Pakyiman International School", "Username", "Password", "Sign in"]`, `no_sideways_scroll`, `min_target_px: 44` |
| `static` | static | yes | `run: [lint, tsc, build]` |

Contract told to the learner in `lab.md`: the bottom bar's root element has the attribute
`data-bottom-bar`, the sidebar's has `data-sidebar`. (The HTML tests find them by these.)

Messages: `one-source` "The school's name is typed in more than one file under src/."
`nav-data` "navigation.ts does not export the expected places in the expected order."
`old-tests` "A unit test from module 2 no longer passes." `pages-answer` "A page does not
answer, or has no single h1." `shell-html` "The shell is not as required: check the
current-place mark in both menus, which menu shows at which width, the short name and the
account menu." `login-html` "The login form is missing a label, an input name, an
autocomplete value or the Sign in button, or it shows the bottom bar." `phone-home` /
`phone-students` "At 360px the bottom bar is incomplete, a tap target is under 44px, or the
page scrolls sideways." `more-page` "The More page does not list every place." `login-page`
"The login page is missing expected text or does not fit at 360px." `static` "Lint, the type
check or the build reports problems."

### Needs

Unit 3.1; module 2's repository. **Network: yes** (`npm install`, shadcn). App running on 3000.

---

## Unit 3.3 — Server Components and the URL as state

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m3-u3` / `m3-p3` |
| title | Server Components and the URL as state |
| module / position | 3 / 3 |
| guidance | guided |
| minutes | `{ min: 870, max: 1290 }` |
| gpis_part | The Students list: search, filters and paging in the URL; a table that becomes cards on phones |
| requires | `[wsl, node, git, playwright]` |

### Outcomes

After this unit you can:

1. say what runs on the server and what runs in the browser, and choose a Server Component by default;
2. read search, filter and page from the address and build links that keep them;
3. filter, order and page a list with pure, tested functions;
4. show a table on wide screens and cards on phones from the same data;
5. design the empty, loading and error states before the happy one is finished.

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a bookmark that opens the register at the same search; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://nextjs.org/docs/app) (read · 10 min). Teach every quiz concept before the quiz.


| § | Section | Key ideas |
| :--- | :--- | :--- |
| 1 | Two places code can run | Server Components: run on the server, can read data, send HTML. Client Components: run in the browser too, can hold state and handle events. Default: server |
| 2 | The address is state | `?q=asante&class=basic-3&page=2`. Shareable, back button works, survives reload, needs no JavaScript |
| 3 | Reading it | The page receives the search parameters; treat them as untrusted text; parse into a typed `StudentListQuery` with defaults |
| 4 | Writing it | Every link is built by one function `studentsHref(query, change)`; a GET form for search needs no JavaScript |
| 5 | Pure list logic | `filterStudents`, `sortStudents`, `paginate` in `src/lib/student-list.ts`; reuse `matchesName` (2.4) and `classRoll` ideas (2.6) |
| 6 | Who is listed | Default: active students with an open membership (D-04). The status filter shows withdrawn or alumni on purpose |
| 7 | Table and cards | One list of rows; `<table>` inside `hidden md:block`, cards inside `md:hidden`; both complete — nothing dropped on phones |
| 8 | Paging | Page size 10; "Page 2 of 3"; previous / next as links; a page past the end shows the last page |
| 9 | States | Empty ("No students match"), with a way out (clear filters); `loading.tsx`; `error.tsx` with a retry |
| 10 | In GPIS | The Students page reads its filters from the URL; name search follows D-247 |

- **Diagram:** request flow: browser address → server reads parameters → pure functions over data → HTML → links carrying the next address.
- **Common mistakes**
  1. Keeping filters in component state → lost on reload and on "back" → the address.
  2. Building links by hand in three places → one forgets the class filter → one `studentsHref`.
  3. Changing the search without going back to page 1 → an empty page 4 → reset `page` when a filter changes.
  4. Dropping columns on phones → information missing → cards with every field.
  5. Trusting `page=abc` or `page=-3` → a crash or an empty list → parse and clamp.

### Guided example — "A book list in the address"

Folder `~/academy-labs/scratch/u3-3/books/` (30 books in a file given by `example.md`).

1. A Server Component page lists all 30 titles.
2. Add `?q=`: a GET form with one input; the page filters. No client code.
3. Write `parseBookQuery(params)` test-first: missing, empty, array value, junk page.
4. Add `?genre=` as links ("chips"); build them with `booksHref`.
5. Add paging (8 per page); show the bug: search on page 3 gives nothing; fix in `booksHref`.
6. Table at `md:`, cards below.
7. Search for "qqq": design the empty state with a "Clear search" link.
8. Add `loading.tsx`; slow the data function by one second to see it.

What you just used: Server Components, search parameters, a GET form, one href builder, pure list functions, responsive table / cards, empty and loading states.

### Quiz plan (`m3-u3-quiz`, 8 questions, pass mark 6)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | A page only reads data and shows it. Which kind of component? | Server Component | Client Component (ships code that is not needed); "both, to be safe"; it does not matter |
| 2 | Why keep the search text in the address? | Reload, back and a shared link all show the same list | "It is faster"; "The address is more secure" (it is visible; not a security feature); "Next.js cannot hold state" |
| 3 | Predict: on page 3 of 5 you type a search that has 4 results; the link keeps `page=3` | An empty page 3 | The 4 results (only if page is reset); an error; page 1 automatically (nothing does that for you) |
| 4 | GPIS D-04: the default Students list shows | Active students with an open membership | Every student ever admitted; everyone with status active even with no class; open memberships whatever the status |
| 5 | GPIS: at 360px a table with 6 columns should | Become cards that show all 6 fields | Hide 3 columns (removes information); scroll sideways; shrink the text to fit |
| 6 | Find the mistake: `const page = Number(params.page)` then `list.slice((page-1)*10, page*10)` | `page` may be `NaN`, 0 or negative; it must be checked and clamped | "`slice` cannot take numbers"; "`Number` is not allowed on the server"; "Nothing is wrong" |
| 7 | GPIS D-247: the search box holds `birikran ama`. Listed? | Ama Serwaa Birikran | Nobody (order matters: no); everyone with "ama" **or** "birikran" (every word must appear); an error |
| 8 | What is a good empty state? | It says nothing matched and offers a way to clear the filters | A blank area (looks broken); the full list (ignores the search); a red error (nothing failed) |

### Lab — project 3.3 Students list (repo project)

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give the command or file and an inline hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Start:** copy the sample data from `lab.md` into `src/data/sample.ts` (see the contract).

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/data/sample.ts` is the given file, unchanged | `sample-data` |
| 2 | `src/lib/student-list.ts` exports `parseStudentListQuery(params)` → `{ q, classSlug, status, page }` with defaults `""`, `null`, `"active"`, `1`; unknown class or status falls back to the default; `page` is a whole number ≥ 1 | `list-logic` |
| 3 | `listStudents(query)` → `{ rows, total, page, pageCount }`: name search by D-247 on first, middle and last name; class filter by current open membership; status filter (`active`, `withdrawn`, `alumni`, `all`); order by last name then first name; 10 per page; a page past the end becomes the last page | `list-logic` |
| 4 | With status `active`, a student needs an open membership **and** status active (D-04) | `list-logic` |
| 5 | `studentsHref(query, change)` builds every link; changing `q`, `class` or `status` resets `page`; defaults are left out of the address | `list-logic`, `links-keep-filters` |
| 6 | `/students` shows a count ("20 students"), "Page 1 of 2", and for each row: name, code, class, status, and a link to `/students/<id>` | `list-default` |
| 7 | Search is a GET form with a labelled input named `q`; class and status are links or a GET form; all work without client JavaScript | `links-keep-filters` |
| 8 | At 360px rows are cards, no sideways scroll, targets ≥ 44px; at `md:` and wider a table | `list-default`, `table-and-cards` |
| 9 | No match: the text "No students match" and a link "Clear filters" to `/students` | `list-empty` |
| 10 | `src/app/(app)/students/loading.tsx` and `error.tsx` exist | `state-files` |

**Steps (guided):** (1) data file; `src/lib/sample-queries.ts` with `allStudents()`,
`currentClassOf(studentId)`; (2) `parseStudentListQuery` test-first; (3) `listStudents`:
search, then class, then status, then order, then paging, a test for each;
(4) `studentsHref` test-first, with the page-reset rule; (5) the page: count and a plain list;
(6) search form; (7) class chips and status select; (8) paging links; (9) table and cards;
(10) empty state; (11) `loading.tsx`, `error.tsx`; (12) checker.

**Hints:** (a) Parameters can arrive as a string, an array or nothing. (b) Build the address
with `URLSearchParams`, and add a key only when it differs from its default. (c) The same
`rows` array feeds the table and the cards.

**Finished state:** `src/data/sample.ts`, `src/lib/sample-queries.ts`, `src/lib/student-list.ts`
(+ tests), `src/app/(app)/students/{page,loading,error}.tsx`, `src/components/students/*`.

### Debugging lab — "The filter that forgets"

| Item | Design |
| :--- | :--- |
| Seeded | `list-bug/`: a Next.js app with a pupils list (40 rows), search, class filter and paging |
| Symptom | "I filter by Basic 4 and press Next. Page 2 shows pupils from every class." Then: "I open the link my colleague sent, `…?page=0`, and the page crashes." |
| Fault 1 | The Next / Previous links are built with only `page`, dropping `q` and `class` |
| Fault 2 | `page` is used without parsing: `slice(-10, 0)` gives nothing and a later `rows[0].name` throws |
| Evidence | Observe: the address before and after pressing Next. Causes: filter logic wrong; link wrong; data wrong. Tests: type the full address by hand with `class=…&page=2` (works → the logic is right, the link is wrong); view the link's `href`. Fix 1: build the link from the whole query. Fault 2: try `page=0`, `page=abc`, `page=999`. Fix 2: parse and clamp in one place |
| Fixed state | Next keeps `q` and `class`; `page=0`, `page=abc` show page 1; `page=999` shows the last page; changes in at most two functions; a unit test for each |

### Own build — the Classes page

1. `/classes` lists the four current classes with their on-roll count (D-04) and a link to `/students?class=<slug>`.
2. `?year=2025-2026` shows last year's classes and their rosters' sizes **for that year** (memberships of that year, whatever the student's status today — the idea of D-76); the current year is the default and is left out of the address.
3. Pure functions with tests; the counts for the current year are 7, 6, 4, 3.
4. Cards on phones, table on computers; an empty state for a year with no classes.
5. `notes/unit-3-3.md`: why the two counts follow different rules.

### Review

- **Checklist extras:** I can reload any state and get the same screen. Every link is built by one function. I tried `page=abc`. Phones show every field.
- **Compare with GPIS:** (1) Open the Students page in the read-only copy (`src/app/…/students/page.tsx`). Which parameters does it read from the address? (2) GPIS's search also accepts "name, class" (`name-class-search.ts`). What does that save a teacher on a phone? (3) Your list filters in memory. GPIS filters in the database. What changes when there are 2,000 students? (Modules 4 and 6.)
- **Mastery:** (1) Add a "gender" filter end to end in 30 minutes, with tests. (2) Explain why the search form needs no JavaScript. (3) Draw the request flow for pressing "Next". (4) List four states of a list screen and what each must show.

**Debugging-lab check** (`m3-p3-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m3-p3-own`). Request two academic years and compare each class count and roster link. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m3-p3`, version 1.0.0, no `lab:`, `requires [wsl, node, git, playwright]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `sample-data` | files | yes | `src/data/sample.ts` `sha256_of: fixtures/sample.ts` |
| `state-files` | files | yes | glob `src/app/**/students/loading.tsx`, `src/app/**/students/error.tsx`; `src/lib/student-list.ts` |
| `list-logic` | tests (files) | yes | Imports `student-list.ts`. `parseStudentListQuery`: `{}`; `{page: "abc"}`; `{page: "-2"}`; `{page: ["2","3"]}`; `{class: "nope"}`; `{status: "x"}`. `listStudents`: default → total 20, pageCount 2, first row id 4 then id 1; `q: "asante"` → ids `[4, 1]`; `q: "kofi asante"` → `[1]`; `q: "a."` same as `q: "a"`; class `basic-3` → total 7; status `withdrawn` → 3 (includes id 5); `alumni` → 1 (id 6); `all` → 24; page 99 → page 2; a student with status active but no open membership (the test adds one to a copy of the data through an exported pure function `listStudentsFrom(data, query)`) is not listed. `studentsHref`: defaults → `/students`; `{q:"a", page:2}` + `{classSlug:"basic-3"}` → `/students?q=a&class=basic-3` (page reset); `+ {page: 2}` keeps both |
| `links-keep-filters` | tests (files) | yes | Fetch `/students?q=a&class=basic-3`: the form has `method="get"` (or no method) and an `<input name="q" value="a">` with a label; fetch `/students?q=a`: the "Next" link's `href` decodes to `/students?q=a&page=2`; fetch `/students?q=a&page=2`: "Previous" → `/students?q=a` |
| `list-default` | page | yes | `http://localhost:3000/students`, `text: ["20 students", "Page 1 of 2", "Abena Asante", "Godfred Kofi Asante"]`, `no_sideways_scroll`, `min_target_px: 44` |
| `list-search` | page | yes | `…/students?q=asante`, `text: ["2 students", "Abena Asante", "Godfred Kofi Asante"]` |
| `list-class` | page | yes | `…/students?class=basic-3`, `text: ["7 students", "Ama Serwaa Birikran"]` |
| `list-status` | page | yes | `…/students?status=withdrawn`, `text: ["3 students", "Kofi Mensah"]` |
| `list-page-2` | page | yes | `…/students?page=2`, `text: ["Page 2 of 2"]` |
| `list-empty` | page | yes | `…/students?q=zzz`, `text: ["No students match", "Clear filters"]` |
| `table-and-cards` | tests (files) | yes | Fetch `/students`: one `<table>` inside an element whose classes include `hidden` and `md:block`; an element with `md:hidden` containing 10 items with `data-student-card`; each card's text contains a code starting `ADM/GPIS/` |
| `static` | static | yes | `run: [lint, tsc, build]` |

Contract told to the learner: each phone card has `data-student-card`.

Messages: `sample-data` "src/data/sample.ts is not the given file." `state-files` "The
loading or error file for the Students page is missing." `list-logic` "The list functions
give a wrong result. The failed test names say which rule." `links-keep-filters` "A link or
the search form loses the current search or filter." `list-default` "The Students page does
not show the expected count, paging or first rows, or does not fit at 360px." `list-search`
"Searching for asante does not list exactly the two expected students." `list-class`
"Filtering by Basic 3 does not show 7 students." `list-status` "The withdrawn filter does
not show the 3 withdrawn students." `list-page-2` "Page 2 is not shown as Page 2 of 2."
`list-empty` "A search with no result must say No students match and offer Clear filters."
`table-and-cards` "The page needs a table for wide screens and complete cards for phones."
`static` "Lint, the type check or the build reports problems."

### Needs

Unit 3.2; `matchesName` (2.4), types and `classRoll` ideas (2.6). App running on 3000.

---

## Unit 3.4 — Dynamic routes and tabs

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m3-u4` / `m3-p4` |
| title | Dynamic routes and tabs |
| module / position | 3 / 4 |
| guidance | half |
| minutes | `{ min: 780, max: 1140 }` |
| gpis_part | The student profile: overview, class history from memberships, documents |
| requires | `[wsl, node, git, playwright]` |

### Outcomes

After this unit you can:

1. build a page whose address contains an id, and handle an id that does not exist;
2. show tabs whose selected tab lives in the address;
3. present a student's class history from membership records, oldest to newest;
4. lay out read-only details so that a phone shows everything a computer shows;
5. use `not-found` correctly instead of an empty or broken page.

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with tabs in a pupil’s paper file; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://nextjs.org/docs/app) (read · 10 min). Teach every quiz concept before the quiz.


| § | Section | Key ideas |
| :--- | :--- | :--- |
| 1 | A folder with a name in brackets | `students/[id]/page.tsx`; the parameter is text; parse it; unknown → `notFound()` |
| 2 | Tabs are links | `?tab=history`; the tab list is `role="tablist"`-free plain navigation with `aria-current`; default tab left out of the address |
| 3 | Derived facts | Current class = open membership (never a field). Class history = memberships in date order, with gaps (D-19, D-23) |
| 4 | Status is shown, not hidden | A withdrawn student's profile says so at the top; history stays (D-23) |
| 5 | Definition lists | `dl` / `dt` / `dd` for label–value pairs; one column on phones, two at `md:` |
| 6 | Actions that do not exist yet | The Documents tab lists the documents GPIS will produce (D-33) as disabled rows with "Built in module 5 / 9", not as dead links |
| 7 | In GPIS | Profile tabs; teachers view, admins act; document actions live on the profile |

- **Diagram:** none (the unit reuses the request-flow diagram of 3.3).
- **Common mistakes**
  1. `Number(params.id)` without a check → `NaN` reaches the data function → validate, then `notFound()`.
  2. Tabs as client state → a shared link opens the wrong tab → the address.
  3. Showing "Class: —" for a withdrawn student with no explanation → looks like a bug → say "No current class (withdrawn 6 November 2026)".
  4. Hiding the history table on phones → the temporal model is invisible → cards.
  5. A dead `href="#"` → a tap that does nothing → a disabled row with a reason.

### Guided example — "A book page with tabs" (first half in full, second half as tasks)

Continues `~/academy-labs/scratch/u3-3/books/`.

1. `books/[id]/page.tsx`; read the id; show the title. *(full)*
2. Unknown id → `notFound()`; add `not-found.tsx`. *(full)*
3. Tabs "About" and "Loans" as links with `?tab=loans`; mark the current one. *(full)*
4. Now do the same for a third tab "Reviews" with an empty state. *(task)*
5. Now show the loan history from a list of loans, newest last, with "still out" for an open loan. *(task)*
6. Now make the details a `dl` that is one column at 360px. *(task)*

### Quiz plan (`m3-u4-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | `/students/999` where no such student exists should | Show the not-found page with status 404 | Show an empty profile with status 200 (looks like a real, blank student); redirect to the list without a word; crash with 500 |
| 2 | GPIS D-19 / D-23: Kofi was withdrawn in November. His profile's class history shows | His JHS 2 membership with its end date; "Current class" says there is none | Nothing (history must stay); JHS 2 as current (the membership ended); a class called "Withdrawn" |
| 3 | Predict: the address is `/students/2?tab=history`, the user reloads | The History tab is still open | Overview (only if the tab were client state); an error; the list page |
| 4 | Which element pairs a label with its value in a read-only profile? | `dl` with `dt` and `dd` | A `table` with one row; two `div`s; `label` and `input disabled` |
| 5 | Find the mistake: `const id = Number(params.id); const s = getStudent(id);` for `/students/abc` | `id` is `NaN`; it must be checked before use | "`Number` cannot be used on the server"; "`params` is always a number"; "Nothing is wrong" |
| 6 | GPIS D-21: Ama was in Basic 2 last year. Under "2025/2026" her history shows | Basic 2 | Basic 3 (today's class); both; nothing until she graduates |

### Lab — project 3.4 Student profile (repo project)

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `/students/<id>` shows the student's full name as `h1`, code, status, and current class (or a sentence saying there is none, and why) | `profile-active`, `profile-withdrawn` |
| 2 | An id that is not a whole number, or that matches nobody, gives the not-found page with status 404 | `not-found` |
| 3 | Three tabs as links: Overview (default, `/students/<id>`), Class history (`?tab=history`), Documents (`?tab=documents`); the open tab has `aria-current="page"`; an unknown `tab` value shows Overview | `tabs-html` |
| 4 | Overview: date of birth (as `14 March 2017`), age today (from `schoolToday`), gender, guardian phone, House | `profile-active` |
| 5 | Class history: one row per membership, oldest first: academic year, class, from, to ("now" when open); a gap between memberships is shown as its own row "Not enrolled" with dates | `history-ama`, `history-logic` |
| 6 | Documents: Report card, Admission letter, Student ID card, Transfer letter, Testimonial letter, each a disabled row with "Not built yet" (JHS 3 students see "Results slip" in place of "Report card") | `documents`, `documents-jhs3` |
| 7 | At 360px every field is shown; no sideways scroll; targets ≥ 44px | page steps |
| 8 | A "Back to students" link; the list's rows link here | `tabs-html` |
| 9 | Pure function `classHistory` in `src/lib/…` with tests (your 2.6 own build may be reused) | `history-logic` |

**Hints** (folded): (1) Look up how a page receives its route parameter in the Next.js docs
in `node_modules/next/dist/docs/`. (2) For "age today", you already wrote two functions in
module 2. (3) A gap is the time between one membership's end and the next one's start.
(4) The tab links are built like `studentsHref`.

**Finished state:** `src/app/(app)/students/[id]/page.tsx`, `not-found.tsx`,
`src/components/students/profile-*.tsx`, `src/lib/class-history.ts` (+ tests).

### Debugging lab — "Everyone is in Basic 3"

| Item | Design |
| :--- | :--- |
| Seeded | `profile-bug/`: a profile page over data where two pupils changed class |
| Symptom | "On the history tab every year shows the pupil's class of today." Then: "The profile of pupil 07 opens pupil 7's page, but pupil 7a also opens it." |
| Fault 1 | The history row prints `currentClass.name` (found once, outside the loop), not the class of each membership |
| Fault 2 | `parseInt(params.id)` accepts `7a` and `07` |
| Evidence | Observe: two pupils' history. Causes: data wrong; lookup by wrong id; printing the wrong variable. Tests: log each membership's `classId`; open `/pupils/7a`. Fix 1: use the row's class. Fix 2: a strict whole-number pattern, else not found |
| Fixed state | History shows each year's own class; `/pupils/7a` and `/pupils/07` are 404; two small changes |

### Own build — a class page

1. `/classes/<slug>` shows the class name, the current roll (D-04) as cards / table, and the on-roll count.
2. `?term=<id>` shows the roll **as it was** in a past term of last year: students whose membership covered that term, whatever their status today, labelled "Historical roster" (the idea of D-76). No status filter there.
3. Unknown slug → 404.
4. Tests for the two roster functions, including Kofi (withdrawn): absent from today's JHS 2 roll, present in the Term 1 2026/2027 historical roster.
5. `notes/unit-3-4.md`: why the two rosters use different rules.

### Review

- **Checklist extras:** unknown ids give 404. The tab survives reload. The history shows each period's own class. Nothing is missing at 360px.
- **Compare with GPIS:** (1) Open a student profile page in the read-only copy. What tabs does it have, and which is in the address? (2) GPIS's `/records` area is read-only by decision (D-75, D-76). Why must a historical roster not filter on `status = 'active'`? (3) Where on the GPIS profile do document actions live, and which decision put them there?
- **Mastery:** (1) Add a fourth tab in 15 minutes. (2) Explain to someone why "current class" is a sentence for a withdrawn student, not a blank. (3) From memory, write the gap rule. (4) Name the three wrong ids you would always test.

**Debugging-lab check** (`m3-p4-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m3-p4-own`). Open a historical term and compare the roll with a current-term roll. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m3-p4`, version 1.0.0, no `lab:`, `requires [wsl, node, git, playwright]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `history-logic` | tests (files) | yes | Imports `src/lib/class-history.ts`, `classHistory(data, studentId)`: student 2 → two rows (2025/2026 Basic 2, ended; 2026/2027 Basic 3, open); student 5 → last row ended `2026-11-06`; a test student with a one-term gap (added to a copy of the data) → a "gap" row between two memberships; input unchanged |
| `not-found` | tests (files) | yes | Fetch `/students/999`, `/students/abc`, `/students/1a`, `/students/01`: status 404 each |
| `tabs-html` | tests (files) | yes | Fetch `/students/2`: three tab links with hrefs `/students/2`, `/students/2?tab=history`, `/students/2?tab=documents`; `aria-current="page"` on Overview only; with `?tab=history` on Class history only; with `?tab=nonsense` on Overview; a link to `/students`; and `/students` page links to `/students/4` |
| `profile-active` | page | yes | `http://localhost:3000/students/1`, `text: ["Godfred Kofi Asante", "Basic 3", "Active", "Date of birth", "Guardian phone", "House"]`, `no_sideways_scroll`, `min_target_px: 44` |
| `profile-withdrawn` | page | yes | `…/students/5`, `text: ["Kofi Mensah", "Withdrawn", "No current class"]` |
| `history-ama` | page | yes | `…/students/2?tab=history`, `text: ["2025/2026", "Basic 2", "2026/2027", "Basic 3", "now"]`, `no_sideways_scroll` |
| `history-kofi` | page | yes | `…/students/5?tab=history`, `text: ["JHS 2", "6 November 2026"]` |
| `documents` | page | yes | `…/students/1?tab=documents`, `text: ["Report card", "Admission letter", "Student ID card", "Transfer letter", "Testimonial letter", "Not built yet"]` |
| `documents-jhs3` | page | yes | `…/students/3?tab=documents`, `text: ["Results slip"]` |
| `static` | static | yes | `run: [lint, tsc, build]` |

Messages: `history-logic` "classHistory gives wrong rows. Check order, the open membership
and gaps." `not-found` "An id that matches no student must give a 404 page." `tabs-html`
"The tabs are not links with the tab in the address, or the open tab is not marked."
`profile-active` "The profile of an active student is missing expected details or does not
fit at 360px." `profile-withdrawn` "A withdrawn student's profile must say so and explain
that there is no current class." `history-ama` "Class history does not show each year's own
class." `history-kofi` "An ended membership must show its end date." `documents` "The
Documents tab does not list the expected documents as not built yet." `documents-jhs3` "A
JHS 3 student must see Results slip, not Report card." `static` "Lint, the type check or the
build reports problems."

### Needs

Unit 3.3 (sample data, list). App running on 3000.

---

## Unit 3.5 — Client Components and forms

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m3-u5` / `m3-p5` |
| title | Client Components and forms |
| module / position | 3 / 5 |
| guidance | half |
| minutes | `{ min: 960, max: 1440 }` |
| gpis_part | The score entry screen: one part at a time, autosave, one bottom button (D-257) |
| requires | `[wsl, node, git, playwright]` |

The four interactive steps use the local score page with the phone viewport and a fresh draft.

### Outcomes

After this unit you can:

1. decide where the line between Server and Client Component goes, and keep the client part small;
2. hold form state with `useState`, and validate each field with a pure function as the user types;
3. save a draft to the browser's storage and restore it, without ever showing a wrong value;
4. build a screen with exactly one main action that changes with the situation;
5. warn before the user loses work, and only then.

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a teacher writing one mark and keeping a draft; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://nextjs.org/docs/app) (read · 10 min). Teach every quiz concept before the quiz.


| § | Section | Key ideas |
| :--- | :--- | :--- |
| 1 | When the browser must run code | Events, state, storage. `"use client"` at the top of the file; everything it imports ships to the browser |
| 2 | Server shell, client island | The page (server) loads class, subject, roster and part from the address; it passes plain data to one client component |
| 3 | State | `useState`; state is per component; never copy props into state without a reason; derive what can be derived |
| 4 | Controlled inputs | `value` + `onChange`; keep what the user typed as **text**; parse separately (`parseMark`, 2.3) |
| 5 | Showing a problem | Under the box, a few words ("Max 15"); `aria-invalid`, `aria-describedby`; never clear what was typed |
| 6 | A local draft | `localStorage`, one key per class + subject; write on every valid change; read once after mounting (the server has no storage) |
| 7 | The tick | "✓ Saved" after a write; it never says "Saving…" (D-257) |
| 8 | One bottom button | A pure function `bottomAction(state)` chooses: marks to fix → next part → submit. Test it without a browser |
| 9 | Leaving with unsaved work | Only invalid marks are unsaved; `beforeunload` while any exist; no warning otherwise |
| 10 | Phone typing | `inputMode="decimal"`, 44px boxes, Enter moves to the next student, the bar above the keyboard |
| 11 | In GPIS | D-257 in full; D-162: zero, blank and ABS; Class Test is filled from Monthly tests, shown as a locked chip |

- **Diagram:** the screen at 360px as boxes: header (subject, "✓ Saved", one small line) / part chips / list of students with one box each / the one bottom button.
- **Common mistakes**
  1. `"use client"` on the page → the whole page and its data code go to the browser → a small island.
  2. Storing the parsed number in state → "12." cannot be typed → store text, parse for checks.
  3. Reading `localStorage` while rendering → the server and the browser disagree (a hydration error) → read in an effect.
  4. Saving invalid text to the draft → a wrong mark comes back tomorrow → save only what `parseMark` accepts.
  5. Three buttons at the bottom ("Save", "Next", "Submit") → the user must think → one, chosen by the state.

**Planning a project.** Recall the three plans from Project 1.6. Show one edge case for this milestone and how to turn it into a test before implementing it.

### Guided example — "Attendance for one class" (first half in full, second as tasks)

Folder `~/academy-labs/scratch/u3-5/attendance/`. One class, one day: each pupil is
Present, Absent or Late; a note of at most 40 characters.

1. Server page loads the pupils and passes them to `<AttendanceSheet>` (client). *(full)*
2. State: a record of pupil id → `{ mark, note }`; controlled inputs. *(full)*
3. A pure `validateNote`; show "40 characters max" under the box, `aria-invalid`. *(full)*
4. Draft: write to `localStorage` on change; restore after mount; the tick. *(full)*
5. Now add one bottom button chosen by a pure function: "2 notes to fix ↑" or "Done". *(task)*
6. Now warn on leaving only while a note is invalid. *(task)*
7. Now make Enter move to the next pupil. *(task)*

### Quiz plan (`m3-u5-quiz`, 8 questions, pass mark 6)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | Which needs a Client Component? | A box that shows "Max 15" while the user types | A list of students from data; a link to the next page; a heading from the config module (all three are server work) |
| 2 | GPIS D-257: how many buttons at the bottom of the entry screen? | One, whose label depends on the state | Two: Save and Next (removed: every mark autosaves); three; none, saving happens on leaving |
| 3 | GPIS D-257: on Individual Test, two marks are invalid and more parts follow. The button says | "2 marks to fix ↑" | "Next: Group Work ›" (fixing comes first in the order of priority); "Submit Mathematics"; "Save" |
| 4 | GPIS D-162: a teacher clears a box. What is stored in the draft for that pupil and part? | Blank (`null`) | 0 (invents a zero); "ABS" (absence is typed on purpose); the previous value |
| 5 | Predict: state holds the number from `Number(text)`; the user types `1`, `2`, `.` | The box shows `12` and the dot is lost | `12.` is kept (only if text is stored); `NaN`; an error |
| 6 | Find the mistake: `const [draft] = useState(JSON.parse(localStorage.getItem(key)))` in a component rendered on the server first | `localStorage` does not exist on the server; read it after mounting | "`JSON.parse` is not allowed in React"; "`useState` cannot hold objects"; "Nothing is wrong" |
| 7 | GPIS D-257: what does Submit tell the teacher before it submits? | "Blank marks stay blank. They are not counted as 0." with the blank counts | "All blanks will be set to 0"; nothing; "You cannot submit with blanks" |
| 8 | When should the page warn before leaving? | Only while something typed has not been saved | Always (people learn to ignore it); never; only on phones |

### Lab — project 3.5 Score entry screen (repo project)

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


**Step 1 · Plan the milestone.** In `lab.md`, list the following exact implementation
paths. Before the first change to any of them, commit `requirements.md`, `spec.md`
and `decisions.md` together under `docs/plans/3.5/`. Use the headings in guide §0.4.

- `src/app/(app)/scores/[classSlug]/page.tsx`
- `src/app/(app)/scores/[classSlug]/[subjectSlug]/page.tsx`
- `src/components/scores/entry-sheet.tsx`
- `src/lib/score-entry.ts`


The course already created the Scores index in Project 3.2. The history check starts with the new detail routes, entry sheet and score-entry module listed above.

Address: `/scores/<classSlug>/<subjectSlug>?part=<part>`; parts `individual` (default, left
out of the address), `group`, `project`, `exam`. `/scores` lists the classes; a class lists
its subjects (plain links; kept simple).

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `/scores/basic-3/mathematics` shows the subject, the class, "Draft", and the seven active students of Basic 3 in last-name order, each with one box for the current part | `entry-first-part` |
| 2 | Part chips with maxima: "Ind Test 15", "Group Work 15", "Project Work 15", "Exam 100", as links that change `part`; the current chip has `aria-current`; a dashed, locked chip "Class test auto" that is not a link | `chips-html` |
| 3 | An unknown class, subject or part gives 404 | `unknown-404` |
| 4 | Each box: a label with the student's name, `inputmode="decimal"`, at least 44px high; it accepts what `parseMark` accepts (numbers to two decimals up to the part's maximum, blank, `ABS`) | `entry-first-part`, `typing` |
| 5 | A value `parseMark` refuses stays in the box, is marked `aria-invalid="true"`, shows a short reason ("Max 15", "Numbers only", "2 decimals max") and is **not** saved | `typing` |
| 6 | Every accepted change is saved at once to `localStorage` under `gpis-draft:<classSlug>:<subjectSlug>` as JSON `{ [studentId]: { individual, group, project, exam } }` with numbers, `"ABS"` or `null`; the header shows "✓ Saved" and never "Saving…" | `draft` |
| 7 | Reloading, or moving to another part and back, shows the saved values | `draft` |
| 8 | One bottom button, by priority: "N marks to fix ↑" (focuses the first invalid box); else "Next: <part> ›" (a link to the next part); else, on Exam, "Submit Mathematics" | `bottom-action-logic`, `bottom-button` |
| 9 | Submit opens a dialog with "Blank marks stay blank. They are not counted as 0." and the number of blanks; its confirm button is disabled and labelled "Submitting is built in unit 5.4" | `bottom-button` |
| 10 | Enter in a box moves to the next student's box | `typing` |
| 11 | Leaving the page while a box is invalid asks for confirmation; with no invalid box it does not | `leave-warning` |
| 12 | `src/lib/score-entry.ts` holds pure functions `bottomAction(state)` and `countBlanks(draft, roster)`, with your tests; the client component is the only `"use client"` file under `src/app/(app)/scores` and `src/components/scores` besides small UI parts | `bottom-action-logic`, `client-files` |

**Hints** (folded): (1) Keep the typed text in state; call `parseMark` when you need to know
if it is valid. (2) `bottomAction` needs three facts: how many invalid, which part, which
subject. (3) Storage is read in an effect, after the first render. (4) `beforeunload` is the
browser event for leaving.

**Finished state:** `src/app/(app)/scores/page.tsx`, `[classSlug]/page.tsx`,
`[classSlug]/[subjectSlug]/page.tsx`; `src/components/scores/entry-sheet.tsx` (client);
`src/lib/score-entry.ts` (+ tests); `playwright` in `devDependencies`.

### Debugging lab — "The mark that came back wrong"

| Item | Design |
| :--- | :--- |
| Seeded | `entry-bug/`: a small entry screen with a local draft |
| Symptom | "I typed 15 for Esi, then changed my mind and typed 150 by mistake. It showed 'Max 15'. I closed the phone. Today the box says 150 and there is no warning." Then: "The console shows a red 'hydration' message on every load." |
| Fault 1 | The draft is written on every change **before** validation, and on load the stored value is shown without being parsed again |
| Fault 2 | The draft is read from `localStorage` during the first render (inside `useState(() => …)` behind `typeof window` — the server renders empty boxes, the browser renders filled ones) |
| Evidence | Observe: the stored JSON (browser storage inspector), the box, the console text. Causes: validation missing; saved before validation; not re-validated on load. Tests: type 150, read storage; reload. Fix 1: save only accepted values (and parse on load). Fault 2 tests: view source of the page against the screen. Fix 2: read in an effect |
| Fixed state | 150 is never in storage; after reload the box shows the last valid value (15) or the draft's; no hydration message; two changes |

### Own build — a full grid for computers

1. At `lg:` and wider, a toggle link `?view=grid` shows one row per student and one column per part (the "full grid" of GPIS D-255, by idea), using the same draft and the same validation.
2. Arrow keys move between boxes in the grid.
3. In the grid the bottom button is "N marks to fix ↑" or "Submit Mathematics" at once.
4. Phones never show the grid; `?view=grid` at 360px shows the one-part view.
5. A total column shows `calculateTotal` (2.3) per student: a number when complete, blank otherwise, never 0 for a blank.
6. `notes/unit-3-5.md`: which code is shared between the two views and which is not.

### Review

- **Checklist extras:** only one file needed `"use client"`. A blank stays blank and a 0 stays 0 after reload. Invalid text is never stored. The bottom of the screen has one button.
- **Compare with GPIS:** (1) Read D-257 in `docs/DECISIONS.md`. Which two button states did you not build, and what do they need that you do not have yet? ("Not saved · Retry" and "Next subject".) (2) GPIS autosaves to the server, not only to the browser. What can go wrong with a browser-only draft on a shared phone? (3) GPIS names its test file for this screen in D-257 point 6. Open it. What does it check at 360px that you checked by hand?
- **Mastery:** (1) Write `bottomAction` again from memory with five tests. (2) Explain the hydration error to someone with a drawing of server HTML against browser HTML. (3) Add a fifth part in a scratch branch and list every place that had to change. (4) Explain why the box keeps "150" visible when it is refused.

**Debugging-lab check** (`m3-p5-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m3-p5-own`). At computer width edit a mark in grid view and reopen it in single-part view. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m3-p5`, version 1.0.0, no `lab:`, `requires [wsl, node, git, playwright]`)

Add three required `doc` steps for the plans in `docs/plans/3.5/`, one per file,
with the headings in §0.4. Add a required `tests` step for the decision count and
the Git ancestry check in §0.4, using the literal paths in step 1 above.


| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `bottom-action-logic` | tests (files) | yes | Imports `src/lib/score-entry.ts`. `bottomAction({ invalidCount: 2, part: "individual", subjectName: "Mathematics" })` → `{ kind: "fix", label: "2 marks to fix ↑" }`; 1 invalid → "1 mark to fix ↑"; 0 invalid on individual → `{ kind: "next", label: "Next: Group Work ›", part: "group" }`; on group → Project Work; on project → Exam; on exam → `{ kind: "submit", label: "Submit Mathematics" }`; invalid on exam → fix first. `countBlanks`: a draft with one student missing and one `null` → counts per part; `"ABS"` and 0 are not blanks |
| `client-files` | tests (run) | yes | `grep -rl '"use client"' 'src/app/(app)/scores' \| wc -l \| tr -d ' '` → `"0\n"` (pages are server files) |
| `unknown-404` | tests (files) | yes | Fetch `/scores/nope/mathematics`, `/scores/basic-3/nope`, `/scores/basic-3/mathematics?part=nope` → 404 |
| `chips-html` | tests (files) | yes | Fetch `/scores/basic-3/mathematics?part=group`: four chip links with the texts above and hrefs for each part (default part without `?part`); `aria-current` on Group Work; an element with text "Class test auto" that is not inside an `<a>`; seven `<input>` with `inputmode="decimal"`, each with a `<label>` containing a student's name |
| `entry-first-part` | page | yes | `http://localhost:3000/scores/basic-3/mathematics`, `text: ["Mathematics", "Basic 3", "Draft", "Ind Test 15", "Exam 100", "Class test auto", "Godfred Kofi Asante", "Next: Group Work"]`, `no_sideways_scroll`, `min_target_px: 44` |
| `entry-exam-part` | page | yes | `…?part=exam`, `text: ["Submit Mathematics"]` |
| `typing` | page | yes | At 360px: type `12` for the first student → no `aria-invalid`; type `16` → `aria-invalid="true"` and "Max 15" visible, box still shows `16`; type `abc` → "Numbers only"; `7.555` → "2 decimals max"; `abs` → accepted; press Enter → focus is in the second student's box |
| `draft` | page | yes | Use `fill` with each pupil’s label for `12`, `0`, `ABS`, leave one blank, and `16` in the fifth box; use `expect_local_storage` for the full fixture JSON in `localStorage["gpis-draft:basic-3:mathematics"]`: values `12`, `0`, `"ABS"`, `null` or missing, and **no** 16; "✓ Saved" visible and the page never contained "Saving"; reload → boxes show `12`, `0`, `ABS`, empty; go to Group Work and back → the same |
| `bottom-button` | page | yes | With one invalid box the only button in the bottom bar reads "1 mark to fix ↑", and clicking it focuses that box; after correcting it reads "Next: Group Work ›" and leads to `?part=group`; on Exam "Submit Mathematics" opens a dialog containing "Blank marks stay blank. They are not counted as 0." and a disabled confirm button |
| `leave-warning` | page | yes | Use `fill` to enter 16 for a 15-mark part, assert `expect_leave_warning: true`, then fill 12 and assert `expect_leave_warning: false` |
| `static` | static | yes | `run: [lint, tsc, build]` |

Contract told to the learner: the bottom bar of this screen has `data-entry-action`; each
mark box has `data-student-id`.

Messages: `bottom-action-logic` "bottomAction or countBlanks gives a wrong result. The
failed test names say which state." `client-files` "A page file under scores is a Client
Component. Keep the page on the server and the sheet as the client part." `unknown-404` "An
unknown class, subject or part must give a 404 page." `chips-html` "The part chips or the
mark boxes are not as required." `entry-first-part` "The entry screen does not show the
expected header, chips, students or bottom button at 360px." `entry-exam-part` "On the last
part the bottom button must be Submit Mathematics." `typing` "A mark was wrongly accepted
or refused, the reason is missing, or Enter does not move to the next student." `draft`
"The local draft is wrong: a refused value was saved, a blank or zero changed, or values do
not come back after reload." `bottom-button` "The bottom button does not follow the order:
marks to fix, next part, submit." `leave-warning` "The page must warn before leaving only
while a mark is invalid." `static` "Lint, the type check or the build reports problems."

### Needs

Units 3.3–3.4; `parseMark` (2.3). `npm install --save-dev playwright` (network). App running.

---

## Unit 3.6 — Printing

### Front matter

| Field | Value |
| :--- | :--- |
| id / project | `m3-u6` / `m3-p6` |
| title | Printing |
| module / position | 3 / 6 |
| guidance | half |
| minutes | `{ min: 810, max: 1230 }` |
| gpis_part | The shared print layer: A4 portrait, one header from the school config, used by every document (D-07, D-33) |
| requires | `[wsl, node, git, playwright]` |

### Outcomes

After this unit you can:

1. style a page for paper with print media rules and `@page`;
2. build one print layout component and reuse it for two documents;
3. keep screen-only parts (navigation, buttons) off the paper;
4. control page breaks so a row is never cut in half;
5. explain why the header is built once, before any document.

### Lesson

Teach each idea below in the four layers of guide §0.1. Start with a report laid on A4 paper; use the technical terms and the smallest worked case from the outline next. Put longer walkthroughs in the guided example. For “Learn more”, select the relevant section of the [free reference](https://nextjs.org/docs/app) (read · 10 min). Teach every quiz concept before the quiz.


| § | Section | Key ideas |
| :--- | :--- | :--- |
| 1 | Paper is another screen size | `@media print`; Tailwind `print:` utilities; the browser's print preview is the test tool |
| 2 | `@page` | `size: A4 portrait`; margins in millimetres; one rule, in one CSS file |
| 3 | What must not print | The shell: `print:hidden` on sidebar, bottom bar, top bar, buttons |
| 4 | One layer, many documents | `<PrintPage title>`: header (logo, school name, address, phone from `school.ts`), body slot, footer (printed date from `schoolToday`) |
| 5 | Breaks | `break-inside: avoid` on rows and cards; `break-after: page` between documents in a batch; table headers repeat |
| 6 | Ink and colour | Black on white; borders, not backgrounds; no reliance on colour |
| 7 | Blank is blank | A missing value prints as an empty cell, never 0 or "N/A" (D-10) |
| 8 | In GPIS | D-07 portrait only; D-33 shared layer first; D-34 the ID card sheet is the exception; the legacy system hard-coded the school name in a route handler |

- **Diagram:** an A4 portrait page as boxes: header band / title / body / footer, with the margins marked.
- **Common mistakes**
  1. Copying the header into each document → the sixth copy differs → one component.
  2. Leaving the bottom bar visible → it prints on every page → `print:hidden`.
  3. Setting page size in two places → they disagree → one `@page` rule.
  4. A table row split across pages → unreadable → `break-inside: avoid`.
  5. Printing 0 for a missing score → a wrong statement about a child → blank.

### Guided example — "A printed notice" (first half in full)

Continues the notice app of 3.1.

1. Open print preview on the notice page; list what is wrong (nav printed, margins, colours). *(full)*
2. Add `@page { size: A4 portrait; margin: 15mm }` to `globals.css`. *(full)*
3. `print:hidden` on header nav and footer links. *(full)*
4. A `PrintSheet` component with a letterhead from a config file; use it on the notice. *(full)*
5. Now reuse `PrintSheet` for a second document, an events table of 60 rows. *(task)*
6. Now stop rows splitting and make the table header repeat. *(task)*
7. Now add a "Print" button that is itself not printed. *(task)*

### Quiz plan (`m3-u6-quiz`, 6 questions, pass mark 4)

| # | Idea | Right answer | Wrong options and why |
| :--- | :--- | :--- | :--- |
| 1 | GPIS D-07: how are documents produced? | By the browser's own printing, A4 portrait, with print styles | By a PDF library on the server (explicitly not used); as images; landscape for wide tables |
| 2 | GPIS D-33: what is built first? | The shared print layer | The report card (the most important document); the ID card; whichever is needed soonest |
| 3 | Predict: `class="print:hidden"` on the bottom bar | Shown on screen, absent on paper | Hidden everywhere; shown only on paper; no effect without JavaScript |
| 4 | GPIS D-10: a pupil has no Science score. The printed cell shows | Nothing | 0 (says "scored nothing"); "N/A" (not the rule); "—" (not the rule: blank means blank) |
| 5 | Find the mistake: two documents each contain `<h1>Great Pakyiman International School</h1>` | The name is hard-coded twice; it must come from the config module through the shared header | "`h1` cannot be printed"; "Only one document may have a header"; "Nothing is wrong" |
| 6 | A table row is cut in two by a page end. Which rule fixes it? | `break-inside: avoid` on the row | `overflow: hidden`; `position: fixed`; a smaller font |

### Lab — project 3.6 Print layer (repo project)

Open with what the learner is building and why. Use the numbered requirements below as the steps. Give a place to look in a closed hint under each numbered step. End with “How to check your work”, the copyable main command and what a pass shows.


Documents: **Class list** `/print/class-list/<classSlug>` and **Student summary**
`/print/student/<id>`.

**What done means**

| # | Requirement | Step |
| :--- | :--- | :--- |
| 1 | `src/components/print/print-page.tsx` is the only place that draws the letterhead: logo, school name, address lines and phone from `school.ts`, then the document title; and a footer "Printed 14 November 2026" using `schoolToday` | `one-header`, `class-list`, `student-summary` |
| 2 | Both documents use it; neither repeats any school detail | `one-header` |
| 3 | One `@page` rule in the project: `size: A4 portrait` with margins | `one-page-rule` |
| 4 | The shell (sidebar, bottom bar, top bar) and every button are not printed | `print-hidden-html`, `print-media` (T35, optional) |
| 5 | Class list: title "Class list — Basic 3", academic year, term, "On roll: 7", a numbered table (No., Name, Code, Gender) of the active students with an open membership (D-04), last-name order; rows do not split across pages | `class-list`, `class-list-html` |
| 6 | Student summary: name, code, class, date of birth, guardian phone, House, and the class history table; a missing value (for example no middle name, no phone) prints an empty cell | `student-summary`, `blank-is-blank` |
| 7 | Each document has a "Print" button (calls the browser's print) and a "Back" link, neither printed; the profile's Documents tab gains a working row "Student summary"; the class page or Students list links to the class list | `print-hidden-html` |
| 8 | Unknown class or student → 404 | `unknown-404` |
| 9 | On screen at 360px the document can be read without sideways scroll | page steps |

**Hints** (folded): (1) Tailwind's `print:` prefix works like `md:`. (2) Put `@page` in the
global stylesheet. (3) The print pages can live in their own route group with a layout that
does not draw the shell at all — then what must you still hide? (4) `window.print()` needs a
tiny Client Component.

**Finished state:** `src/app/print/…` (or a route group), `src/components/print/print-page.tsx`,
`print-button.tsx`, one `@page` rule in `src/app/globals.css`.

### Debugging lab — "Page 2 has no heading and half a pupil"

| Item | Design |
| :--- | :--- |
| Seeded | `print-bug/`: a 45-row class register with a print stylesheet |
| Symptom | "The second page starts in the middle of a pupil's row, and it has no column headings." Then: "The printout is landscape on the office computer but portrait on mine." |
| Fault 1 | Rows are `div`s in a flex column with no `break-inside`; the heading row is a `div`, not a `thead` |
| Fault 2 | Two `@page` rules: `globals.css` says portrait; a later `register.css` says `size: landscape`; which wins depends on load order |
| Evidence | Observe in print preview: page 2. Causes: browser setting; missing break rule; wrong element. Tests: add `break-inside: avoid` in the inspector; search the project for `@page`. Fix 1: a real table with `thead`, plus the break rule. Fix 2: delete the second rule |
| Fixed state | Print preview: every page starts with the headings and whole rows; one `@page` rule; portrait |

### Own build — a batch

1. `/print/class-summaries/<classSlug>` prints the student summary of **every** student on the roll, one per page (`break-after: page`), using the same component as the single summary.
2. The last page has no blank page after it.
3. A cover line on the first page: class, count, date.
4. A second paper size is **not** added; explain in `notes/unit-3-6.md` why D-07 says portrait only, and what D-34's exception is.
5. Unit test for the function that builds the batch data.

### Review

- **Checklist extras:** I looked at print preview for both documents. The header exists in one file. One `@page` rule. Nothing from the shell is on paper. A missing value is an empty cell.
- **Compare with GPIS:** (1) Find the shared print component under `src/components/print/` (or `src/lib/print/`) in the read-only copy. Which documents use it? (2) Read D-33's reason for building the layer first. What happened in the legacy Word export (`routes/admission.py:1042`)? (3) Why is the ID card sheet (D-34) not "one document per page", and what does it need that an A4 document does not?
- **Mastery:** (1) Add a third document (a blank marks sheet for one subject) in 30 minutes using the layer. (2) From memory, write the `@page` rule and one break rule. (3) Explain why browser printing was chosen over a PDF library, with one cost and one benefit. (4) Show in print preview that the bottom bar is gone.

**Debugging-lab check** (`m3-p6-debug`). Use the debugging lab’s seeded fault and fixed-state contract above as the failing and passing cases. Check the diagnosis headings and repeat the original failing input and assert the repaired outcome.

**Own-build check** (`m3-p6-own`). Compare batch roster size with summary count and check page breaks in print preview. Run it on the empty starting state and on the completed variation. Keep judgement about the learner’s explanation in the review.

### Check plan (`m3-p6`, version 1.0.0, no `lab:`, `requires [wsl, node, git, playwright]`)

| Step id | Kind | Req. | Verifies |
| :--- | :--- | :--- | :--- |
| `one-header` | tests (run) | yes | `grep -rlE 'school\.(name\|addressLines\|phone\|logoPath)' src/app src/components \| grep -c 'print'` and the total count: exactly one file under `src/components/print/` reads `school.addressLines`, and no file under `src/app/print` (or the print route group) reads `school.` at all (two greps joined with `&&`; the exact command is the builder's, the rule is this row) |
| `one-page-rule` | tests (run) | yes | `grep -rE '@page' src --include='*.css' --include='*.tsx' \| wc -l \| tr -d ' '` → `"1\n"`, and `grep -rcE 'size:\s*A4 portrait' src/app/globals.css` → `"1\n"` |
| `unknown-404` | tests (files) | yes | `/print/class-list/nope`, `/print/student/999` → 404 |
| `class-list-html` | tests (files) | yes | Fetch `/print/class-list/basic-3`: a `<table>` with `<thead>`; 7 body rows; first row name "Abena…" is **not** there (she is Basic 4) and the names are in last-name order; rows numbered 1–7; an element with `data-print-header` containing the school's name; Kofi Mensah absent from `/print/class-list/jhs-2` |
| `print-hidden-html` | tests (files) | yes | In both documents' HTML: any element with `data-bottom-bar`, `data-sidebar` or `data-top-bar` is absent or has `print:hidden` in its class; every `<button>` and the Back link have `print:hidden`; `/students/1?tab=documents` contains a link to `/print/student/1` |
| `blank-is-blank` | tests (files) | yes | Fetch `/print/student/<id of a sample student with no middle name and no guardian phone>`: the value cells for those rows are empty (no `0`, `N/A`, `-`, `—`, `null`, `undefined`) |
| `class-list` | page | yes | `http://localhost:3000/print/class-list/basic-3`, `text: ["Great Pakyiman International School", "Class list — Basic 3", "On roll: 7", "Godfred Kofi Asante", "Printed"]`, `no_sideways_scroll` |
| `student-summary` | page | yes | `…/print/student/2`, `text: ["Great Pakyiman International School", "Ama Serwaa Birikran", "Basic 2", "Basic 3", "Printed"]`, `no_sideways_scroll` |
| `print-media` (T35) | page | no | Open the Basic 3 class list with `media: print`. Use `expect_text` for the school name and class title. Mark each shell area and each screen-only control (including Print and Back) with `data-testid="screen-only"`; `expect_count: { testid: screen-only, count: 0 }` checks visibility. Repeat on the student summary with `goto`. Keep the HTML coverage check for all buttons and the CSS assertion for A4 portrait. |
| `static` | static | yes | `run: [lint, tsc, build]` |

The sample data contract gains one fact for this unit: student 7 has `middleName: null` and
`guardianPhone: null`.

Messages: `one-header` "School details are read in more than one print file. Only the
shared print page may draw the letterhead." `one-page-rule` "There must be exactly one
@page rule, and it must say A4 portrait." `unknown-404` "An unknown class or student must
give a 404 page." `class-list-html` "The class list is not a table of the 7 students on the
roll, in order, with the shared header." `print-hidden-html` "A button, the Back link or
part of the shell would be printed, or the profile does not link to the summary."
`blank-is-blank` "A missing value is printed as something other than an empty cell."
`class-list` / `student-summary` "The document is missing expected content or does not fit
at 360px." `print-media` "In print, the header must show and the shell and buttons must
not." `static` "Lint, the type check or the build reports problems."

### Needs

Units 3.2–3.4. App running on 3000.

---

## After module 3 the learner has

A Next.js app with shell, login page (no sign-in), Students list and profile, score entry
with a local draft, and a print layer; all on sample data behind `src/lib/sample-queries.ts`.
Module 4 builds the real database; module 5 replaces the sample source and adds sign-in,
admission, import, submission and issuing. A deployed portfolio site.
