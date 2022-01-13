import { assertEquals, assertExists, assertObjectMatch } from "../deps.ts";
import { CValues } from "./parser.ts";
import { cInstruction } from "./patterns.ts";

Deno.test("Parses a C instructions", () => {
  const validInstructions: Array<[string, CValues]> = [
    ["AM=M+D;JGE", { dest: "AM", comp: "M+D", jump: "JGE" }],
    ["AM=M+D", { dest: "AM", comp: "M+D", jump: undefined }],
    ["M+D;JGE", { dest: undefined, comp: "M+D", jump: "JGE" }],
    [";JGE", { dest: undefined, comp: undefined, jump: "JGE" }],
    ["M+D", { dest: undefined, comp: "M+D", jump: undefined }],
    ["0", {dest: undefined, comp: "0", jump: undefined}],
    ["1", {dest: undefined, comp: "1", jump: undefined}],
    ["-1", {dest: undefined, comp: "-1", jump: undefined}],
  ];

  const invalidInstructions : Array<string> = [
      "AMM+D;JGE",
      "JGE",
  ]

  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = instruction.match(cInstruction);
    assertExists(result?.groups);
    assertObjectMatch(result.groups, expectedResult);
  });

  invalidInstructions.forEach((instruction) => {
      const result = instruction.match(cInstruction);
      assertEquals(result?.groups, undefined);
  });
});
