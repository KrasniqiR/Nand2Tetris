import { aInstruction, cInstruction, label, variable } from "./patterns.ts";
import { addSymbolTableEntry } from "./symbol_table.ts";

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
  & { error?: Error }
  & (
    | { commandType: "A" | "L"; symbol: string }
    | (
      & {
        commandType: "C";
      }
      & CValues
    )
  );

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

export function injectSymbols(
  instructions: string[],
  symbolTable: Record<string, number>,
) {
  /**
   * 1. Label check
   *    a. Check if label in table
   *    b. Add label to table (i + 1)
   *    c. Pop instruction from array.
   * 2. Variable check
   *    a. Check if symbol in table
   *    b. If in table, replace with symbol value
   *    c. Add Symbol as iterated next
   */

  let symbolInjectedInstructions: string[] = [];
  let newLabels: string[] = [];
  let newVariables: string[] = [];

  instructions.forEach((instruction, index) => {
    const isLabel = label.test(instruction);
    if (isLabel) {
      const label = getL(instruction);
      addSymbolTableEntry(label, "instruction", index);
      newLabels.push(label);
      return;
    } else {
      symbolInjectedInstructions.push(instruction);
    }
  });

  newLabels.forEach((label) => {
    symbolInjectedInstructions = symbolInjectedInstructions.map((instruction) =>
      instruction.replace(label, `${symbolTable[label]}`)
    );
  });

  instructions.forEach((instruction, index) => {
    const varName = instruction.match(variable)?.groups?.variable;
    
    if (varName && !symbolTable[varName]) {
      addSymbolTableEntry(varName, "variable");
      newVariables.push(varName);
    }
  });

  newVariables.forEach((variable) => {
    symbolInjectedInstructions = symbolInjectedInstructions.map((instruction) =>
      instruction.replace(variable, `${symbolTable[variable]}`)
    );
  });

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
    throw new Error("Invalid jump instruction");
  }

  if (dest && !DEST_VALUES.includes(dest as DestValues)) {
    throw new Error("Invalid dest instruction");
  }

  return { comp, dest, jump };
}

function getA(instruction: string): string {
  const aValue = instruction.match(aInstruction);

  if (aValue?.length !== 1) {
    throw new Error("Unable to parse A instruction");
  }

  return aValue[0];
}

function getL(instruction: string): string {
  const labelValue = instruction.match(label);
  if (labelValue?.length !== 1) {
    throw new Error("Unable to parse L instruction");
  }
  return labelValue[0];
}
