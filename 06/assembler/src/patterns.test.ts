import {assertObjectMatch, assertExists} from '../deps.ts';
import { cInstruction } from "./patterns.ts";

Deno.test("Parses a C instruction", () => {
    const instruction = "AM=M+D;JGE"
    const result = instruction.match(cInstruction);
    assertExists(result?.groups);
    assertObjectMatch(result.groups, {dest: 'AM', comp: 'M+D', jump: 'JGE'});
})