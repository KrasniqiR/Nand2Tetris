import { aInstruction, label, jmp, comp } from "./patterns.ts";

type CommandType = 
/** A instruction (set M) */
'A' | 
/** Comp instruction */
'C' | 
/** L instruction (Assign symbol) */
'L';

type CompMemoryReferences = 'A' | 'M' | 'D'
type PairOperators = '+' | '-' | '|' | '&' | '!';
type SingularOperators = '-' | '!';

type CompValues = {
    dest: DestValues,
} &
( 
    {
        value1: CompMemoryReferences
        operator: SingularOperators
    } 
    | {
        value1: CompMemoryReferences
        value2: CompMemoryReferences
        operator: PairOperators
    }
);


const JUMP_MNEMONICS = ['null', 'JGT', 'JEQ', 'JGE', 'JLT', 'JNE', 'JLE', 'JMP'] as const;
type JumpMneominc = typeof JUMP_MNEMONICS[number];
type JumpValues = [number, JumpMneominc];

type DestValues = `null` | `${'A' | ''}${'M' | ''}${'D'|''}`

type ParseResult = ({
    commandType: 'C',    
} & ( {
    comp: CompValues,
    dest: DestValues
    
} |  {
    jump: JumpValues,
    
})
)
| {commandType: 'A' | 'L', symbol: string} |
 {error: Error};

export function parse (instruction: string) : ParseResult {
    try {
        const commandType = getCommandType(instruction);

        switch (commandType) {
            case 'A':
                return {commandType, symbol: getA(instruction)};
            case 'L':
                return {commandType, symbol: getL(instruction)};
            case 'C':
                return  {commandType, comp: getComp(instruction), dest: getDest(instruction), jump: getJump(instruction)};    
        }

    } catch (error) {
        return {error}
    }
}

function getCommandType (command: string) : CommandType {
    // Ignore all whitespace
    const trimmedCommand = command.replaceAll(/\s*/, "");
    
    switch (true) {
        case (aInstruction.test(trimmedCommand)):
            return 'A';
        case (label.test(trimmedCommand)):
            return 'L';
        case (jmp.test(trimmedCommand) || comp.test(trimmedCommand) ):
            return 'C';
    }

    throw new Error(`Invalid command ${command}`);
}

function getComp(instruction: string): DestValues {
    const compValues = instruction.match(comp);
    return 
}

function getJump(instruction: string): JumpValues {
    const jmpValues = instruction.match(jmp);
    return 'ADD'
}

function getDest(instruction: string): JumpValues {
    const jmpValues = instruction.match(jmp);
    return 'A'
}

function getA(instruction: string): string {
    const aValue = instruction.match(aInstruction);
    return ''
}

function getL(instruction: string): string {
    const labelValue = instruction.match(label);
    return ''
}