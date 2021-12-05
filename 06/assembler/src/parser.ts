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
    error?: Error;
} | {commandType: 'A' | 'L', symbol: string, error: Error};

function parse (instruction: string) : ParseResult {
    const commandType = getCommandType(instruction);

    

    return {};
}

function getCommandType (command: string) : CommandType {
    const trimmedCommand = command.trim();
    switch (true) {
        case (aInstruction.test(trimmedCommand)):
            return 'A';
        case (label.test(trimmedCommand)):
            return 'L';
        case (jmp.test(trimmedCommand) || comp.test(trimmedCommand) ):
            return 'C';
    }
    throw new Error(`Invalid command ${command}`)
}

function getComp(command: string): string {

}

function getJump(command: string): string {

}