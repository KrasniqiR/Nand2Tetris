import { readLines } from "../deps.ts";
import { code } from "./code.ts";

async function assemble() {
    const fileName = path.join(Deno.cwd(), Deno.args[0])
    const assemblyProgram = await Deno.readTextFile(fileName);
    const lines = assemblyProgram.split('\n')

    let binary=[];
    
    for await (let line of lines) {  
        const {commandType, symbol, comp, dest,jump, error } = parse(line);

        if (error) {
            console.error(error);
            Deno.exit(1);
        }

        if (commandType === 'C' ) {
            const binaryLine = code({comp, dest, jump});
            binary.push(binaryLine);
        }
        
    }
    
}

function insertSybols() {

}