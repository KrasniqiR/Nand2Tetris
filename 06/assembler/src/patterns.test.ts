import { assertEquals, assertExists, assertObjectMatch } from "../deps.ts";
import { CValues } from "./parser.ts";
import { aInstruction, cInstructionComposed, label } from "./patterns.ts";

Deno.test("RexExp parses a C instructions into comp, dest and jump values and returns undefined if instruction is invalid.", () => {
  const validInstructions: Array<[string, CValues]> = [
    ["AM=M+D;JGE", { dest: "AM", comp: "M+D", jump: "JGE" }],
    ["AM=M+D", { dest: "AM", comp: "M+D", jump: undefined }],
    ["M+D;JGE", { dest: undefined, comp: "M+D", jump: "JGE" }],
    [";JGE", { dest: undefined, comp: undefined, jump: "JGE" }],
    ["M+D", { dest: undefined, comp: "M+D", jump: undefined }],
    ["0", { dest: undefined, comp: "0", jump: undefined }],
    ["1", { dest: undefined, comp: "1", jump: undefined }],
    ["-1", { dest: undefined, comp: "-1", jump: undefined }],
  ];

  const invalidInstructions: Array<string> = [
    "AMM+D;JGE",
    "JGE",
  ];

  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = instruction.match(cInstructionComposed);
    assertExists(result?.groups);
    assertObjectMatch(result.groups, expectedResult);
  });

  invalidInstructions.forEach((instruction) => {
    const result = instruction.match(cInstructionComposed);
    assertEquals(result?.groups, undefined);
  });
});

Deno.test("A instruction patterns correctly detect and parse A values or symbols", () => {
  const validInstructions: Array<[string, string]> = [
    ["@FOO", "FOO"],
    ["@1842", "1842"],
    ["@BAZ", "BAZ"],
    ["@_Underscore", "_Underscore"],
  ];

  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = instruction.match(aInstruction);
    assertExists(result?.[0]);
    assertEquals(result[0], expectedResult);
  });
});

Deno.test("L instruction pattern correctly detects and parses L instructions", () => {
  const validInstructions: Array<[string, string]> = [
    ["(LOOP)", "LOOP"],
    ["(WHILE)", "WHILE"],
  ];

  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = instruction.match(label);
    assertExists(result?.[0]);
    assertEquals(result[0], expectedResult);
  });
});
