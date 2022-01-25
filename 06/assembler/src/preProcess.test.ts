import { assertEquals } from "../deps.ts";
import { injectSymbols, preProcess } from "./preProcess.ts";
import { SymbolTable } from "./symbol_table.ts";

Deno.test('Preprocess strips comments, whitespace and injects symbols', () => {
    const instructions = [
        "// This file is part of www.nand2tetris.org\r",
        '// and the book "The Elements of Computing Systems"\r',
        "// by Nisan and Schocken, MIT Press.\r",
        "// File name: projects/06/add/Add.asm\r",
        "\r",
        "// Computes R0 = 2 + 3  (R0 refers to RAM[0])\r",
        "\r",
        "@2\r",
        "D=A\r",
        "@3\r",
        "D=D+A\r",
        "@0\r",
        "M=D\r",
        ""
      ];
    
      const result = preProcess(instructions, SymbolTable);
      assertEquals(result, ["@2", "@D=A", "@3", "D=D+A", "@0", "M=D"]);
});

Deno.test("injectSymbols replaces variables and labels with ROM and RAM addresses", () => {
 const instructions = ["(LOOP)", "2", "@D=A", "@Varname", "@3", "D=D+A", "@0", "M=D"];
 const expectedResult = ["2", "@D=A", "@16", "@3", "D=D+A", "@0", "M=D"];

 const result = injectSymbols(instructions, SymbolTable);
 assertEquals(result, expectedResult);
})