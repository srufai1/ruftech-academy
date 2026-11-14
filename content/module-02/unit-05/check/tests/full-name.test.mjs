// D-46: first word is the first name, the rest the last name; one word is an error.
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadSrc } from "./load.mjs";

const { splitFullName } = await loadSrc("full-name");
const AMA = { firstName: "Ama", lastName: "Birikran" };

test("two spaces between the words", () => assert.deepEqual(splitFullName("Ama  Birikran"), AMA));
test("spaces before and after the name", () => assert.deepEqual(splitFullName("  Ama Birikran "), AMA));
test("a tab between the words", () => assert.deepEqual(splitFullName("Ama\tBirikran"), AMA));
test("three words: the rest is the last name", () => assert.deepEqual(splitFullName("Ama Serwaa Birikran"), { firstName: "Ama", lastName: "Serwaa Birikran" }));
test("one word is an error", () => assert.ok("error" in splitFullName("Ama")));
test("only spaces is an error", () => assert.ok("error" in splitFullName("   ")));
