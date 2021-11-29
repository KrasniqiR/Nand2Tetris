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
    commandType: CommandType,
    symbol: string,
    comp?: CompMnemonic,
    dest?: DestMnemonic,
    jump?: JumpMnemonic
    error?: Error;
}

function parse (instruction: string) : ParseResult {
    
}

function getCommandType (command: string) : CommandType {
    switch (command) {
        
    }
    return;
}

function getComp(command: string): string {

}

function getJump(command: string): string {

}