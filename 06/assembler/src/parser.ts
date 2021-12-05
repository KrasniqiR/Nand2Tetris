import { aInstruction,label,jmp,comp } from "./patterns.ts";

type CommandType = 
/** A instruction (set M) */
'A' | 
/** Comp instruction */
'C' | 
/** L instruction (Assign symbol) */
'L';

type CompMnemonic = 'ADD';
type DestMnemonic = 'ADD';
type JumpMnemonic = 'ADD';

type ParseResult = {
    commandType: 'C',
    comp?: CompMnemonic,
    dest?: DestMnemonic,
} | {commandType: 'A' | 'L', symbol: string} | {error: Error};

function parse (instruction: string) : ParseResult {
    try {
        const commandType = getCommandType(instruction);

        switch (commandType) {
            case 'A':
                return {commandType, symbol: getA(instruction)};
            case 'L':
                return {commandType, symbol: getS(instruction)};
            case 'C':
                return  {commandType, comp: getComp(instruction), dest: getJump(instruction)};
                
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

function getComp(command: string): DestMnemonic {
    return 'ADD'
}

function getJump(command: string): DestMnemonic {
    return 'ADD'

}

function getA(command: string): string {
    return ''
}

function getS(command: string): string {
    return ''
}