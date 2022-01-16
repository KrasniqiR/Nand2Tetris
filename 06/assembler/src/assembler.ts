import { join } from "../deps.ts";
import { code } from "./code.ts";
import { parse } from "./parser.ts";

async function assemble() {
  const fileName = join(Deno.cwd(), Deno.args[0]);
  const assemblyProgram = await Deno.readTextFile(fileName);
  const lines = assemblyProgram.split("\n");

  let instructionBinaries = [];

  for await (let line of lines) {
    const parseResult = parse(line);
    if (parseResult.error) {
      throw parseResult.error;
    }

    switch (parseResult.commandType) {
      case "C": 
         const binary = `111${compField(parseResult.comp)}${destField(parseResult.dest)}${jumpField(parseResult.jump)}`;
         instructionBinaries.push(binary);
         break;
      case "A":
        
        break;
      case "L":
        break;
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

function insertSybols() {
}
