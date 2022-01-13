import { assertExists, assertObjectMatch } from "../deps.ts";
import { cInstruction } from "./patterns.ts";

Deno.test("Parses a C instructions", () => {
  const instructionsResultsMap: Array<[string, any]> = [
    ["AM=M+D;JGE", { dest: "AM", comp: "M+D", jump: "JGE" }],
    // ["0", {comp: "0"}],
  ];

  instructionsResultsMap.forEach(([instruction, expectedResult]) => {
    console.log(instruction, expectedResult);
    const result = instruction.match(cInstruction);
    console.log(result);
    assertExists(result?.groups);
    assertObjectMatch(result.groups, expectedResult);
  });
});
