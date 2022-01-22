import { assertEquals } from "../deps.ts";
import { rExp } from "./regEx.ts";

Deno.test("rExp plucks source and merges interpolated strings", () => {
  const a = rExp`^${"abc"}`;
  assertEquals(a.source, "^abc");
});
