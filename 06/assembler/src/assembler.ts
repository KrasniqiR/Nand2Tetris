import { basename, join } from "../deps.ts";
import { parse } from "./parser.ts";
import { preProcess } from "./preProcess.ts";
import { SymbolTable } from "./symbol_table.ts";
import { floatToBinary, leftPad } from "./util.ts";
import { compField, destField, jumpField } from "./code.ts";

assemble();

async function assemble() {
  const fileName = join(Deno.cwd(), Deno.args[0]);
  const assemblyProgram = await Deno.readTextFile(fileName);
  const program = assemblyProgram.split("\n");

  try {
    const lines = preProcess(program, SymbolTable);

    const binaryInstructions = lines.map((line) => {
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
          const binary = `0${floatToBinary(address).padStart(15, '0')}`;
          // if (binary.length > 16) {
          //   throw new Error(`Overflow. 
          //   Instruction: ${parseResult.symbol}
          //   Result: ${binary}`);
          // }

          return binary;
        }
        case "L": {
          //TODO: Convert to instruction address.
          const address = parseInt(parseResult.symbol);
          const binary = `0${floatToBinary(address).padStart(15, '0')}`;
          return binary;
        }
      }
    });

    const binary = binaryInstructions.join("\n");
    const outFileName = join(Deno.cwd(), `${basename(Deno.args[0])}.hack`)
    console.log(`Writing to ${outFileName}`);
    
    await Deno.writeTextFile(outFileName, binary);
  } catch (e) {
    console.error(e);
  }
}
