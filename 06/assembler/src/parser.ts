import { aInstruction, cInstruction, label } from "./patterns.ts";

type CommandType =
  /** A instruction (set M) */
  | "A"
  | /** Comp instruction */ "C"
  | /** L instruction (Assign symbol) */ "L";

type CompMemoryReferences = "A" | "M" | "D";
type PairOperators = "+" | "-" | "|" | "&" | "!";
type SingularOperators = "-" | "!";

type CompValues = string;

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
  | (
    & {
      commandType: "C";
    }
    & (
      CValues
    )
  )
  | { commandType: "A" | "L"; symbol: string }
  | { error: Error };

export function parse(instruction: string): ParseResult {
  // Ignore all whitespace
  const trimmedInstruction = instruction.replaceAll(/\s*/, "");
  try {
    const commandType = getCommandType(trimmedInstruction);

    switch (commandType) {
      case "A":
        return { commandType, symbol: getA(trimmedInstruction) };
      case "L":
        return { commandType, symbol: getL(trimmedInstruction) };
      case "C":
        return {
          commandType,
          ...getC(trimmedInstruction),
        };
    }
  } catch (error) {
    return { error };
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

  if (!compValues?.groups) throw new Error("Invalid C instruction");

  const { comp, dest, jump } = compValues.groups;

  if (jump && !JUMP_MNEMONICS.includes(jump as JumpMnemonic)) {
    throw new Error("Invalid jump instruction");
  }

  if (dest && !DEST_VALUES.includes(dest as DestValues)) {
    throw new Error("Invalid dest instruction");
  }

  return { comp, dest, jump };
}

// function getJump(instruction: string): JumpValues {
//   const jValues = instruction.match(jmp);
//   if (!jValues) throw new Error("Error parsing jump instruction");
//   if (jValues?.length > 2 || jValues?.length == 0) {
//     throw new Error("Error parsing jump instruction");
//   }

//   return jValues.slice(2);
// }

// function getDest(instruction: string): JumpValues {
//   const jmpValues = instruction.match(jmp);
//   return "A";
// }

function getA(instruction: string): string {
  const aValue = instruction.match(aInstruction);

  if (aValue?.length !== 1) {
    throw new Error("Could not parse A instruction");
  }

  return aValue[0];
}

function getL(instruction: string): string {
  const labelValue = instruction.match(label);
  if (labelValue?.length !== 1) {
    throw new Error("Could not parse A instruction");
  }
  return labelValue[0];
}
