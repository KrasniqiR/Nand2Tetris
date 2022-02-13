import { assertEquals, assertExists, assertObjectMatch } from "../deps.ts";
import { CValues } from "./parser.ts";
import { aInstruction, cInstructionComposed, label } from "./patterns.ts";
import { injectVariable } from "./preProcess.ts";

Deno.test("RexExp parses a C instructions into comp, dest and jump values and returns undefined if instruction is invalid.", () => {
  const validInstructions: Array<[string, CValues]> = [
    ["AM=M+D;JGE", { dest: "AM", comp: "M+D", jump: "JGE" }],
    ["AM=M+D", { dest: "AM", comp: "M+D", jump: undefined }],
    ["AM=M-1", { dest: "AM", comp: "M-1", jump: undefined }],
    ["M+D;JGE", { dest: undefined, comp: "M+D", jump: "JGE" }],
    [";JGE", { dest: undefined, comp: undefined, jump: "JGE" }],
    ["M+D", { dest: undefined, comp: "M+D", jump: undefined }],
    ["0", { dest: undefined, comp: "0", jump: undefined }],
    ["1", { dest: undefined, comp: "1", jump: undefined }],
    ["-1", { dest: undefined, comp: "-1", jump: undefined }],
    ["D=A", { dest: "D", comp: "A", jump: undefined }],
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
    assertExists(result?.groups);
    assertEquals(result.groups.instruction, expectedResult);
  });
});

Deno.test("L instruction pattern correctly detects and parses L instructions", () => {
  const validInstructions: Array<[string, string]> = [
    ["(LOOP)", "LOOP"],
    ["(WHILE)", "WHILE"],
  ];

  validInstructions.forEach(([instruction, expectedResult]) => {
    const result = instruction.match(label);
    assertExists(result?.groups);
    assertEquals(result?.groups.label, expectedResult);
  });
});

Deno.test("Variable replacement correctly replaces variables for addresses", () => {
  const variable = "ball.setdestination$if_true0";
  const symbolTable = {
    "ball.setdestination$if_true0": 250,
  };
  const instructions: Array<[string, string]> = [
    [`@${variable}`, "@250"],
  ];

  assertEquals(
    injectVariable(variable, instructions[0][0], symbolTable),
    "@250",
  );
});
