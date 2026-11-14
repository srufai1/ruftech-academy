// D-247: every typed word must appear in the name, in any order; case and full stops do not matter.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadLib } from "./load.mjs";

const { matchesName } = await loadLib("name-search");

test("any word order", () => assert.equal(matchesName("Esi Kyei", "kyei esi"), true));
test("case and full stops do not matter", () => assert.equal(matchesName("Godfred Kofi Asante", "ASANTE G."), true));
test("an initial finds the name", () => assert.equal(matchesName("Godfred O. Adu", "o. adu"), true));
test("a word that is not in the name fails", () => assert.equal(matchesName("Ama Serwaa Birikran", "ama mensah"), false));
test("a word may match inside a longer word", () => assert.equal(matchesName("Godfred Adu", "god"), true));
test("an empty query matches every name", () => { assert.equal(matchesName("Esi Kyei", ""), true); assert.equal(matchesName("Esi Kyei", "  "), true); });
