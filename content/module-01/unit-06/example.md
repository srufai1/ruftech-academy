# Guided example — A tiny project, done properly

You will set up a small project for the school tuck shop, with every piece the lab needs:
ignore file, `package.json`, a config module, lint, a verify script, `.env.example` and a
README you have tested.

**Type every command yourself.** Do not paste.

## Step 1 — Repository and ignore file first

```bash
mkdir -p ~/academy-labs/scratch/u1-6/tuck-shop
```

```bash
cd ~/academy-labs/scratch/u1-6/tuck-shop
```

```bash
git init -b main
```

Set your name and email for this repository, as in unit 1.4. Then write the ignore file
**before** anything is installed:

```bash
printf 'node_modules/\n.env\n.env.*\n!.env.example\n' > .gitignore
```

```bash
git add .gitignore
```

```bash
git commit -m "Ignore dependencies and local env files"
```

## Step 2 — `package.json`

```bash
npm init -y
```

```bash
npm pkg set private=true --json
```

```bash
npm pkg set type=module
```

```bash
cat package.json
```

Expected: `"private": true` and `"type": "module"` among the fields.

```bash
git add package.json
```

```bash
git commit -m "Add package.json as a private module"
```

## Step 3 — One fact, one module

```bash
mkdir -p src/config scripts
```

With `nano`, write `src/config/shop.mjs`:

```js
export const shop = { name: "Tuck Shop", opens: "07:30" };
```

And `scripts/shop-info.mjs`:

```js
import { shop } from "../src/config/shop.mjs";

console.log(`${shop.name} opens at ${shop.opens}`);
```

```bash
node scripts/shop-info.mjs
```

Expected: `Tuck Shop opens at 07:30`

Commit both files with a message that says what they are.

## Step 4 — Lint

```bash
npm install --save-dev eslint @eslint/js
```

Expected: `added … packages`. A folder `node_modules/` and a file `package-lock.json` appear.

```bash
git status --short
```

Expected: `M package.json` and `?? package-lock.json`. No `node_modules/`: it is ignored.

With `nano`, write `eslint.config.mjs`:

```js
import js from "@eslint/js";

export default [
  {
    files: ["**/*.mjs"],
    rules: js.configs.recommended.rules,
    languageOptions: { globals: { console: "readonly", process: "readonly" } },
  },
];
```

```bash
npm pkg set scripts.lint="eslint ."
```

```bash
npm run lint
```

Expected: no problems are listed. Commit `eslint.config.mjs`, `package.json` and
`package-lock.json` together.

## Step 5 — Break a rule on purpose

Add this line at the end of `scripts/shop-info.mjs`:

```js
const closes = "16:00";
```

```bash
npm run lint; echo "exit: $?"
```

Expected: `'closes' is assigned a value but never used  no-unused-vars`, then
`✖ 1 problem (1 error, 0 warnings)`, and an exit code that is not 0.

Fix the code: delete the line. Run lint again: no problems.

Stop here if you are between Part A and Part B of the lesson.

## Step 6 — A verify script, wrong and right

First the wrong version. Write `scripts/verify.sh`:

```bash
#!/usr/bin/env bash
npm run lint; echo "verify ok"
```

```bash
chmod u+x scripts/verify.sh
```

Add the unused line from step 5 back. Then:

```bash
./scripts/verify.sh; echo "exit: $?"
```

Expected: the lint error, then `verify ok`, then `exit: 0`. It lies.

Now the right version:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run --silent lint
node scripts/shop-info.mjs > /dev/null
echo "verify ok"
```

```bash
./scripts/verify.sh; echo "exit: $?"
```

Expected: the lint error, no `verify ok`, and an exit code that is not 0. Delete the unused
line again; run it once more: `verify ok`, `exit: 0`. Commit the script.

## Step 7 — `.env.example`

```bash
printf '# Copy to .env and fill in. Never commit .env.\nSHOP_PIN=\n' > .env.example
```

```bash
echo 'SHOP_PIN=4321' > .env
```

```bash
git status --short
```

Expected: `?? .env.example`, and no `.env`. Commit `.env.example`.

## Step 8 — A README you have tested

Write `README.md` with four headings: `## What this is`, `## How to run`,
`## Folder layout`, `## Rules`. Under "How to run" list the exact commands: `npm install`,
then `./scripts/verify.sh`. Commit it.

Now follow it in a fresh copy:

```bash
git clone . ../tuck-shop-copy
```

```bash
cd ../tuck-shop-copy
```

Run the commands from your README, in order. Did they work without anything else? If you had
to do one more thing, your README is missing a step: go back, add it, commit.

## What you used

`npm init` · `npm pkg set` · `npm install --save-dev` · `npm run` · ESLint · `export` /
`import` · `set -euo pipefail` · `git clone`
