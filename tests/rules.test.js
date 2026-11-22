
import { test } from "node:test";
import assert from "node:assert/strict";
import { guessKey } from "../player/rules.js";

test("word order does not matter", () => {
  assert.equal(
    guessKey(["Apple", "Banana", "Cherry", "Date"]),
    guessKey(["Date", "Cherry", "Apple", "Banana"]),
  );
});