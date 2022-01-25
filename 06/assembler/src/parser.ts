import {
  aInstruction,
  cInstructionComposed as cInstruction,
  label,
} from "./patterns.ts";

type CommandType =
  /** A instruction (set M) */
  | "A"
  | /** Comp instruction */ "C"
  | /** L instruction (Assign symbol) */ "L";

const JUMP_MNEMONICS = [
  "null",
  "JGT",
  "JEQ",
  "JGE",
  "JLT",
  "JNE",
  "JLE",
  "JMP",
] as const;

type JumpMnemonic = typeof JUMP_MNEMONICS[number];
type JumpValues = [number | string, JumpMnemonic];

const DEST_VALUES = [
  "null",
  "A",
  "M",
  "D",
  "MD",
  "AD",
  "AM",
  "AMD",
] as const;

type DestValues = typeof DEST_VALUES[number];

export type CValues = {
  comp?: string;
  dest?: string;
  jump?: string;
};

type ParseResult =
  | { commandType: "A" | "L"; symbol: string }
  | (
    & {
      commandType: "C";
    }
    & CValues
  );

export function parse(instruction: string): ParseResult {
  try {
    const commandType = getCommandType(instruction);

    switch (commandType) {
      case "A":
        return { commandType, symbol: getA(instruction) };
      case "L":
        return { commandType, symbol: getL(instruction) };
      case "C":
        return {
          commandType,
          ...getC(instruction),
        };
    }
  } catch (error) {
    throw error;
  }
}

function getCommandType(command: string): CommandType {
  switch (true) {
    case (aInstruction.test(command)):
      return "A";
    case (label.test(command)):
      return "L";
    case (cInstruction.test(command)):
      return "C";
  }

  throw new Error(`Invalid command ${command}`);
}

function getC(instruction: string): CValues {
  const compValues = instruction.match(cInstruction);

  if (!compValues?.groups) {
    throw new Error(`Invalid C instruction:
   ${instruction}
   `);
  }

  const { comp, dest, jump } = compValues.groups;

  if (jump && !JUMP_MNEMONICS.includes(jump as JumpMnemonic)) {
    throw new Error(`Invalid jump instruction ${jump}`);
  }

  if (dest && !DEST_VALUES.includes(dest as DestValues)) {
    throw new Error(`Invalid dest instruction ${dest}`);
  }

  return { comp, dest, jump };
}

export function getA(instruction: string): string {
  const result = instruction.match(aInstruction);
  const aValue= result?.groups && result.groups.instruction;  

  if (!aValue) {
    throw new Error(`Unable to parse A instruction ${instruction}`);
  }

  return aValue;
}

export function getL(instruction: string): string {
  const result = instruction.match(label);
  const  labelValue= result?.groups && result.groups.label;  

  if (!labelValue) {
    throw new Error(`Unable to parse L instruction ${instruction}`);
  }

  return labelValue;
}
