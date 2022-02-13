import { getA, getL } from "./parser.ts";
import { aInstruction, escapeRegex, label, symbol } from "./patterns.ts";
import { rgx } from "./regEx.ts";
import { addSymbolTableEntry, SymbolTable } from "./symbol_table.ts";
import { isFiniteNumber } from "./util.ts";

export function preProcess(
  instructions: string[],
  symbolTable: Record<string, number>,
) {
  // Remove whitespace
  const trimmedInstructions = instructions.map((instruction) =>
    instruction.replaceAll(/\s+/g, "")
  );
  // Remove comments lines
  const strippedInstructions = trimmedInstructions.filter((instruction) =>
    !(instruction.startsWith("//") || instruction === "")
  );
  // Trim inline comments from instructions
  const instructionsNoInlineComments = strippedInstructions.map(
    (instruction) => {
      const commentIndex = instruction.indexOf("//");
      if (commentIndex !== -1) {
        return instruction.slice(0, commentIndex);
      } else {
        return instruction;
      }
    },
  );

  const formattedProgram = injectSymbols(
    instructionsNoInlineComments,
    symbolTable,
  );
  return formattedProgram;
}

export function injectSymbols(
  instructions: string[],
  symbolTable: Record<string, number>,
): string[] {
  const labelInjectedInstructions = injectLabels(instructions, symbolTable);
  const preProcessedInstructions = injectVariables(
    labelInjectedInstructions,
    symbolTable,
  );
  return preProcessedInstructions;
}

/**
 * * 1. Label check
 *    a. Check if label in table
 *    b. Add label to table (i + 1)
 *    c. Pop instruction from array.
 *
 * @param instructions
 * @param symbolTable
 */
export function injectLabels(
  instructions: string[],
  symbolTable: Record<string, number>,
) {
  const result: string[] = [];
  const newLabels: string[] = [];

  instructions.forEach((instruction, index) => {
    const isLabel = label.test(instruction);
    const labelValue = isLabel ? getL(instruction) : undefined;
    const isNewLabel = labelValue && !isFiniteNumber(symbolTable[labelValue]);
    if (isNewLabel) {
      newLabels.push(labelValue);
      // Label instructions are omitted from result set, so create a -ve offset equal to number of previously added labels
      const nextInstructionOffset = newLabels.length;
      const nextInstructionIndex = index + 1 - nextInstructionOffset;
      addSymbolTableEntry(
        labelValue,
        "instructionAddress",
        nextInstructionIndex,
      );
      // Label instructions are stripped from binary, omit from returned result set;
      return;
    } else {
      result.push(instruction);
    }
  });

  return result;
}

/**
 * Variable check
 *  a. Check if symbol in table
 *  b. If in table, replace with symbol value
 *  c. Add Symbol as iterated next
 * @param instructions
 * @param symbolTable
 * @returns
 */
export function injectVariables(
  instructions: string[],
  symbolTable: Record<string, number>,
) {
  let result: string[] = [];

  instructions.forEach((instruction) => {
    const isAInstruction = aInstruction.test(instruction);
    if (isAInstruction) {
      const aInstruction = getA(instruction);
      const isVariable = symbol.test(aInstruction);
      const isNewVariable = isVariable &&
        !isFiniteNumber(symbolTable[aInstruction]);

      if (isNewVariable) {
        addSymbolTableEntry(aInstruction, "variable");
      }
    }

    result.push(instruction);
  });

  const variables = Object.keys(symbolTable);
  variables.forEach((variable) => {
    result = result.map((instruction) => {
      return injectVariable(variable, instruction, symbolTable);
    });
  });

  return result;
}

export function injectVariable(
  variable: string,
  instruction: string,
  symbolTable: typeof SymbolTable,
): string {
  return instruction.replace(
    rgx`@${escapeRegex(variable)}$`,
    `@${symbolTable[variable]}`,
  );
}
