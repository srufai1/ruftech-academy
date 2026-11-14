# Debugging lab — Green, but broken

**Rule for every debugging lab:** find the cause before you change anything. GPIS works by
the same rule: OBSERVE → ISOLATE → TEST → PROVE → DOCUMENT → MOVE ON.

## The report

A colleague says: "`./scripts/verify.sh` says `verify ok`, but `node src/menu.mjs` crashes."
Later she adds: "And `git status` shows changes in `node_modules`, although it is in
`.gitignore`."

## Start

Her repository is built by a setup script. Make the script with one command — it is long, so
here you may paste it — then run it. Do not read it first: find the problems the way you
would at work.

```bash
mkdir -p ~/academy-labs/scratch/u1-6-debug
```

```bash
cd ~/academy-labs/scratch/u1-6-debug
```

````bash
cat > setup-canteen.sh <<'END'
#!/usr/bin/env bash
# Builds a colleague's repository for the debugging lab. Do not read it; run it.
set -euo pipefail
dir=~/academy-labs/scratch/u1-6-debug/canteen
rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
export GIT_AUTHOR_NAME="Lab Seed" GIT_AUTHOR_EMAIL="seed@example.invalid"
export GIT_COMMITTER_NAME="Lab Seed" GIT_COMMITTER_EMAIL="seed@example.invalid"
git init -q -b main
mkdir -p src scripts node_modules/menu-helper
cat > package.json <<'J'
{
  "name": "canteen",
  "private": true,
  "type": "module",
  "scripts": { "lint": "eslint .", "verify": "./scripts/verify.sh" },
  "devDependencies": { "@eslint/js": "^10.0.1", "eslint": "^10.0.0" }
}
J
cat > eslint.config.mjs <<'J'
import js from "@eslint/js";

export default [
  {
    files: ["**/*.mjs"],
    rules: js.configs.recommended.rules,
    languageOptions: { globals: { console: "readonly", process: "readonly" } },
  },
];
J
cat > src/menu.mjs <<'J'
const prices = { rice: 8, beans: 6, kelewele: 5 };
let total = 0;
for (const price of Object.values(prices)) total += price;
console.log(`Menu total: GHS ${totl}`);
J
printf '#!/usr/bin/env bash\nnpm run lint\necho "verify ok"\n' > scripts/verify.sh
chmod 755 scripts/verify.sh
git add package.json eslint.config.mjs src scripts && git commit -q -m "Add the canteen menu and its checks"
printf '{ "name": "menu-helper", "version": "1.0.0" }\n' > node_modules/menu-helper/package.json
printf 'export const helper = true;\n' > node_modules/menu-helper/index.js
git add node_modules && git commit -q -m "Add the menu helper package"
printf 'node_modules/\n' > .gitignore
git add .gitignore && git commit -q -m "Ignore node_modules from now on"
printf '## Observe\n\n## Possible causes\n\n## Tests\n\n## Cause\n\n## Fix\n' > diagnosis.md
echo "ready: cd $dir"
END
````

```bash
bash setup-canteen.sh
```

```bash
cd canteen
```

Set your name and email for this repository. Install the tools (this needs the internet):

```bash
npm install
```

Now do what she did:

```bash
./scripts/verify.sh; echo "exit: $?"
```

```bash
node src/menu.mjs
```

## Your work

Do not fix anything yet. Fill in `diagnosis.md` in that folder:

| Heading | What to write |
| :--- | :--- |
| `## Observe` | The output of `verify.sh`, its exit code, and the error from `node src/menu.mjs` |
| `## Possible causes` | At least three, for example: lint is not run; lint finds nothing; the script hides the failure |
| `## Tests` | One command per cause, with its output: `npm run lint; echo $?`; `bash -x scripts/verify.sh` |
| `## Cause` | The cause the evidence supports |
| `## Fix` | The smallest change, and the command that shows it now works |

There are **two** faults. The second one is about Git. For it, try `git status`,
`git ls-files node_modules` and `git check-ignore -v node_modules`. Observe it as a new
problem.

Do not switch any lint rule off. Do not delete the history.

## Fixed state

- `./scripts/verify.sh` prints `verify ok` and exits 0 only when lint passes. Break the code
  on purpose once to prove it fails.
- `node src/menu.mjs` prints the menu total.
- `git ls-files node_modules` prints nothing, and that change is committed.
- `verify.sh` differs from the one you were given by one line.

## Who checks it

This lab is **self-reviewed**. The checker does not mark it yet. Compare your `diagnosis.md`
with the five headings above, and ask yourself: did I write the cause **before** I changed
anything?
