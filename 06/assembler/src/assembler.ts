import { join } from "../deps.ts";
import { parse } from "./parser.ts";
import { preProcess } from "./preProcess.ts";
import { SymbolTable } from "./symbol_table.ts";
import { leftPad } from "./util.ts";

async function assemble() {
  const fileName = join(Deno.cwd(), Deno.args[0]);
  const assemblyProgram = await Deno.readTextFile(fileName);

  const program = assemblyProgram.split("\n");
  const lines = preProcess(program, SymbolTable);

  let instructionBinaries = [];

  for await (let line of lines) {
    const parseResult = parse(line);
    if (parseResult.error) {
      throw parseResult.error;
    }

    switch (parseResult.commandType) {
      case "C": {
        const binary = `111${compField(parseResult.comp)}${
          destField(parseResult.dest)
        }${jumpField(parseResult.jump)}`;
        instructionBinaries.push(binary);
        break;
      }
      case "A": {
        const address = parseInt(parseResult.symbol);
        const binary = `0${leftPad(floatToBinary(address), 15, "0")}`;
        instructionBinaries.push(binary);
        break;
      }
      case "L": {
        //TODO: Convert to instruction address.
        const address = parseInt(parseResult.symbol);
        const binary = `0${leftPad(floatToBinary(address), 15, "0")}`;
        instructionBinaries.push(binary);
        break;
      }
      default: {
        return;
      }
    }
    // const storeInstruction

    // if (error) {x
    //   console.error(error);
    //   Deno.exit(1);
    // }
  }
}

function floatToBinary(number: number) {
  return (number >>> 0).toString(2);
}
