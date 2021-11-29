import { readLines } from "../deps.ts";

async function assemble() {
    const fileName = path.join(Deno.cwd(), Deno.args[0])
    const assemblyProgram = await Deno.readTextFile(fileName);
    const lines = assemblyProgram.split('\n')
    
    
    

    for await (let line of lines) {  
        const parseOutput = parse(line);
        if (parseOutput.error) {
            console.error(parseOutput.error);
            Deno.exit(1);
        }
        
    }
    
}