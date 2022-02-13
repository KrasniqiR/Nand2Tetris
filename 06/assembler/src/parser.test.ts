import { assertEquals, assertExists } from "../deps.ts";
import { getA, getL } from "./parser.ts";

Deno.test("getL returns label value", () => {
  const validInstructions: Array<[string, string]> = [
    ["(LOOP)", "LOOP"],
    ["(WHILE)", "WHILE"],
  ];

  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = getL(instruction);
    assertExists(result);
    assertEquals(result, expectedResult);
  });
});

Deno.test("getA returns A value", () => {
  const validInstructions: Array<[string, string]> = [
    ["@FOO", "FOO"],
    ["@1842", "1842"],
    ["@BAZ", "BAZ"],
    ["@_Underscore", "_Underscore"],
  ];

  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = getA(instruction);
    assertExists(result);
    assertEquals(result, expectedResult);
  });
});
