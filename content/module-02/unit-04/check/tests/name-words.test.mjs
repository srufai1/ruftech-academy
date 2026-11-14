// D-247: lower-case words, full stops removed, no empty words.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { nameSearchWords } = await loadLib("name-search");

test("a name with an initial", () => assert.deepEqual(nameSearchWords("Adu O. Godfred"), ["adu", "o", "godfred"]));
test("only spaces gives no words", () => assert.deepEqual(nameSearchWords("  "), []));
test("initials joined by full stops", () => assert.deepEqual(nameSearchWords("A.B. Mensah"), ["a", "b", "mensah"]));
test("extra spaces give no empty words", () => assert.deepEqual(nameSearchWords("  Ama   Birikran "), ["ama", "birikran"]));
