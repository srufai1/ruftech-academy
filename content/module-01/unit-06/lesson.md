# A project home

This lesson has two parts. Part A sets up the project. Part B makes it check itself and
leave your laptop safely.

## Part A

## A1. What a repository must tell a stranger

A new teammate opens your repository. They have ten minutes. The **README** must tell them:

1. **What this is** — one paragraph.
2. **How to run** — the exact commands, in order.
3. **Folder layout** — what each folder is for.
4. **Rules** — what they must never do, and where the full rules are.

A README that was never followed by someone else is usually wrong. Test it: follow it
yourself, in a fresh copy.

## A2. Rules you write down

GPIS has a file called `AGENTS.md`. It holds the rules for everyone who changes the code:
which folders may be touched, what to read first, security rules, and how to work. Written
rules beat remembered ones: they are the same tomorrow, and a newcomer can read them.

One GPIS rule you will copy: when something looks wrong, follow **OBSERVE → ISOLATE → TEST →
PROVE → DOCUMENT → MOVE ON**.

## A3. `package.json`

`npm init -y` makes `package.json`, the description of a Node project.

| Field | Meaning |
| :--- | :--- |
| `name` | The project's name |
| `private: true` | npm will refuse to publish it by mistake |
| `type: "module"` | `.js` files use `import` and `export` |
| `scripts` | Named commands: `npm run lint` runs the `lint` script |
| `devDependencies` | Tools needed to build and check, not to run |

`npm install --save-dev eslint` downloads ESLint into `node_modules/` and records it in
`package.json` and `package-lock.json`. Commit `package-lock.json`: it fixes the exact
versions. Never commit `node_modules/`: `npm install` rebuilds it.

## A4. Lint

A **linter** reads your code and reports known mistakes: a variable that is never used, a
name that was never defined. ESLint reads its rules from `eslint.config.mjs`.

When lint reports a problem, fix the code. Do not switch the rule off. An unused variable is
often a step you forgot.

## A5. Modules

A file can **export** a value, and another file can **import** it:

```js
// src/config/school.mjs
export const school = { name: "Great Pakyiman International School", shortName: "GPIS" };
```

```js
// scripts/school-info.mjs
import { school } from "../src/config/school.mjs";
console.log(`${school.name} (${school.shortName})`);
```

A fact used in many places is written **once**, in one module. When it changes, it changes
everywhere.

Stop here. Do steps 1–5 of the guided example. Then read Part B.

## Part B

## B1. One command to check everything

`scripts/verify.sh` runs every check, in order, and stops at the first failure:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run --silent lint
node scripts/school-info.mjs > /dev/null
echo "verify ok"
```

`verify ok` is the **last** line. It is printed only when everything before it worked.

## B2. Why exit codes matter again

Commands joined with `;` all run, whatever happens. Commands joined with `&&`, or a script
with `set -e`, stop at the first failure. In module 7, CI will run exactly this script on
every change. A green run must mean "checked", not "a script reached its end".

## B3. Environment files

Values that differ per computer, or are secret, live in `.env`. That file is never
committed. `.env.example` is committed: it holds the **names** with empty values, and a
comment, so a newcomer knows what to set. GPIS security rule 7 says the same.

```text
# .gitignore
node_modules/
.env
.env.*
!.env.example
```

`.env.*` would also ignore `.env.example`. The `!` line makes an exception.

## B4. A remote

A **remote** is a copy of the repository on another computer, such as GitHub.
`git remote add origin URL` names it. `git push -u origin main` sends your commits.

Make the repository **private** first. Everything you push — every commit in the history —
can be read by whoever can see the repository. Search the history for secrets before the
first push.

## B5. In GPIS

```text
gpis-school-system/
├── README.md            how to run it, current state
├── AGENTS.md            the rules for everyone who changes it
├── docs/                decisions, business rules, designs
├── scripts/             checks that CI runs
├── src/config/school.ts the school's details, written once
├── .env.example         variable names, no values
└── package.json         scripts: lint, build, test
```

Before anyone says "it works", GPIS asks for three commands to pass: lint, build and a type
check.

## Common mistakes

1. Committing `node_modules/` → thousands of files in history → ignore it before the first
   `npm install`.
2. Turning off a lint rule to get green → the mistake stays → fix the code.
3. `verify.sh` joined with `;` → a failure in the middle is hidden → `set -e` or `&&`.
4. The school name typed in three files → one is forgotten when it changes → one config
   module.
5. A README written once and never followed → the steps are wrong → follow it in a fresh
   clone.

## Words to remember

README · rules file · `package.json` · script · dependency · lock file · lint · module ·
export · import · verify script · `.env.example` · remote · push
