import { join } from "../deps.ts";
import { parse } from "./parser.ts";
import { preProcess } from "./preProcess.ts";
import { SymbolTable } from "./symbol_table.ts";
import { floatToBinary, leftPad } from "./util.ts";
import { compField, destField, jumpField } from "./code.ts";

async function assemble() {
  const fileName = join(Deno.cwd(), Deno.args[0]);
  const assemblyProgram = await Deno.readTextFile(fileName);

  const program = assemblyProgram.split("\n");
  const lines = preProcess(program, SymbolTable);

  const binaryInstructions = lines.map((line) => {
    try {
      const parseResult = parse(line);

      switch (parseResult.commandType) {
        case "C": {
          const binary = `111${compField(parseResult.comp)}${
            destField(parseResult.dest)
          }${jumpField(parseResult.jump)}`;
          return binary;
        }
        case "A": {
          const address = parseInt(parseResult.symbol);
          const binary = `0${leftPad(floatToBinary(address), 15, "0")}`;
          return binary;
        }
        case "L": {
          //TODO: Convert to instruction address.
          const address = parseInt(parseResult.symbol);
          const binary = `0${leftPad(floatToBinary(address), 15, "0")}`;
          return binary;
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  });

  const binary = binaryInstructions.join("\n");
  console.log({ binary });
}
