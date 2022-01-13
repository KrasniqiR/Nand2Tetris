import { assertEquals, assertExists, assertObjectMatch } from "../deps.ts";
import { CValues } from "./parser.ts";
import { cInstruction } from "./patterns.ts";

Deno.test("Parses a C instructions", () => {
  const validInstructions: Array<[string, CValues]> = [
    ["AM=M+D;JGE", { dest: "AM", comp: "M+D", jump: "JGE" }],
    ["M+D;JGE", { dest: undefined, comp: "M+D", jump: "JGE" }],
    [";JGE", { dest: undefined, comp: undefined, jump: "JGE" }],
    // ["0", {dest: undefined, comp: "0", jump: undefined}],
  ];

  const invalidInstructions : Array<string> = [
      "AMM+D;JGE",
      "JGE",
  ]


  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = instruction.match(cInstruction);
    console.log("groups", result?.groups)
    assertExists(result?.groups);
    assertObjectMatch(result?.groups, expectedResult);
  });

  invalidInstructions.forEach((instruction) => {
      const result = instruction.match(cInstruction);
      assertEquals(result?.groups, undefined);
  });
});
