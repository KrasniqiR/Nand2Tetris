const destInstructions = [
  "null",
  "M",
  "D",
  "MD",
  "A",
  "AM",
  "AD",
  "AMD",
] as const;
const jumpInstructions = [
  "null",
  "JGT",
  "JEQ",
  "JGE",
  "JLT",
  "JNE",
  "JLE",
  "JMP",
] as const;
const compInstructions = [
  "0",
  "1",
  "-1",
  "D",
  "A",
  "!D",
  "!A",
  "-D",
  "-A",
  "D+1",
  "A+1",
  "D-1",
  "A-1",
  "D+A",
  "D-A",
  "A-D",
  "D&A",
  "D|A",
  "M",
  "!M",
  "-M",
  "M+1",
  "M-1",
  "D+M",
  "D-M",
  "M-D",
  "D&M",
  "D|M",
];

type JumpInstruction = typeof jumpInstructions[number];
type DestInstruction = typeof destInstructions[number];
type CompInstruction = typeof compInstructions[number];

const destInstructionMap: Record<DestInstruction, string> = {
  null: "000",
  M: "001",
  D: "010",
  MD: "011",
  A: "100",
  AM: "101",
  AD: "110",
  AMD: "111",
};

const jumpInstructionMap: Record<JumpInstruction, string> = {
  null: "000",
  JGT: "001",
  JEQ: "010",
  JGE: "011",
  JLT: "100",
  JNE: "101",
  JLE: "110",
  JMP: "111",
};

const compInstructionMap = {
  "0": "0101010",
  "1": "0111111",
  "-1": "0111010",
  "D": "0001100",
  "A": "0110000",
  "!D": "0001101",
  "!A": "0110001",
  "-D": "0001111",
  "-A": "0110011",
  "D+1": "0011111",
  "A+1": "0110111",
  "D-1": "0001110",
  "A-1": "0110010",
  "D+A": "0000010",
  "D-A": "0010011",
  "A-D": "0000111",
  "D&A": "0000000",
  "D|A": "0010101",
  "M": "1110000",
  "!M": "1110001",
  "-M": "1110011",
  "M+1": "1110111",
  "M-1": "1110010",
  "D+M": "1000010",
  "D-M": "1010011",
  "M-D": "1000111",
  "D&M": "1000000",
  "D|M": "1010101",
};

export function destField(mnemonic?: string): string {
  if (!mnemonic) return "000";
  const binary = (destInstructionMap as Record<string,string>)[mnemonic];
  if (!binary) {
    throw new Error(
      `Unable to translate dest mnemonic to binary instruction. Received: ${mnemonic}.`,
    );
  }
  return binary;
}

export function compField(mnemonic?: string): string {
  if (!mnemonic) return "0000000";
  const binary = (compInstructionMap as Record<string,string>)[mnemonic];
  if (!binary) {
    throw new Error(
      `Unable to translate comp mnemonic to binary instruction. Received: ${mnemonic}.`,
    );
  }
  return binary;
}

export function jumpField(mnemonic?: string): string {
  if (!mnemonic) return "000";
  const binary = (jumpInstructionMap as Record<string, string>)[mnemonic];
  if (!binary) {
    throw new Error(
      `Unable to translate jump mnemonic to binary instruction. Received: ${mnemonic}.`,
    );
  }
  return binary;
}
