import { assertEquals } from "../deps.ts";
import { rgx } from "./regEx.ts";

Deno.test("rExp plucks source and merges interpolated strings", () => {
  const a = rgx`^${"abc"}`;
  assertEquals(a.source, "^abc");
});
