import { aInstruction, comp, jmp, label } from "./patterns.ts";

type CommandType =
  /** A instruction (set M) */
  | "A"
  | /** Comp instruction */
  "C"
  | /** L instruction (Assign symbol) */
  "L";

type CompMemoryReferences = "A" | "M" | "D";
type PairOperators = "+" | "-" | "|" | "&" | "!";
type SingularOperators = "-" | "!";

type CompValues =
  & {
    dest: DestValues;
  }
  & (
    | {
      value1: CompMemoryReferences;
      operator?: SingularOperators;
    }
    | {
      value1: CompMemoryReferences;
      value2: CompMemoryReferences;
      operator: PairOperators;
    }
  );

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

type DestValues = `null` | `${"A" | ""}${"M" | ""}${"D" | ""}`;

type ParseResult =
  | (
    & {
      commandType: "C";
    }
    & ({
      comp: CompValues;
      dest: DestValues;
    } | {
      jump: JumpValues;
    })
  )
  | { commandType: "A" | "L"; symbol: string }
  | { error: Error };

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
          comp: getComp(instruction),
          dest: getDest(instruction),
          jump: getJump(instruction),
        };
    }
  } catch (error) {
    return { error };
  }
}

function getCommandType(command: string): CommandType {
  // Ignore all whitespace
  const trimmedCommand = command.replaceAll(/\s*/, "");

  switch (true) {
    case (aInstruction.test(trimmedCommand)):
      return "A";
    case (label.test(trimmedCommand)):
      return "L";
    case (jmp.test(trimmedCommand) || comp.test(trimmedCommand)):
      return "C";
  }

  throw new Error(`Invalid command ${command}`);
}

function getComp(instruction: string): DestValues {
  const compValues = instruction.match(comp);

  if (!compValues) throw new Error("Invalid comp instruction");

  if (compValues.length === 1) {
    return { value1: compValues[0] };

  } else if (compValues.length === 2) {
    return;
  }
  return;
}

function getJump(instruction: string): JumpValues {
  const jValues = instruction.match(jmp);
  if (!jValues) throw new Error("Error parsing jump instruction");
  if (jValues?.length > 2 || jValues?.length == 0) {
    throw new Error("Error parsing jump instruction");
  }

  return jValues.slice(2);
}

function getDest(instruction: string): JumpValues {
  const jmpValues = instruction.match(jmp);
  return "A";
}

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
