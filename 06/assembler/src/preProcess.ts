import { getA, getL } from "./parser.ts";
import { aInstruction, label, symbol } from "./patterns.ts";
import { addSymbolTableEntry } from "./symbol_table.ts";

export function preProcess(
  instructions: string[],
  symbolTable: Record<string, number>,
) {
  const trimmedInstructions = instructions.map((instruction) =>
    instruction.replaceAll(/\s+/g, "")
  );
  // Remove comments
  const strippedInstructions = trimmedInstructions.filter((instruction) =>
    !(instruction.startsWith("//") || instruction === "")
  );
  const formattedProgram = injectSymbols(strippedInstructions, symbolTable);
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
 * @param instructions Array of assembly instructions. Ideally trimmed cleared of comments
 * @param symbolTable
 */
export function injectLabels(
  instructions: string[],
  symbolTable: Record<string, number>,
) {
  let result: string[] = [];
  let newLabels: string[] = [];

  instructions.forEach((instruction, index) => {
    const isLabel = label.test(instruction);
    if (isLabel) {  
      const label = getL(instruction);
      newLabels.push(label);
      // Label instructions are omitted from result set, so create a -ve offset equal to number of previously added labels
      const nextInstructionOffset = newLabels.length;
      const nextInstructionIndex = index + 1 - nextInstructionOffset;
      addSymbolTableEntry(label, "instruction", nextInstructionIndex);
      // If label declared, omit this line from the result.
      return;
    } else {
      result.push(instruction);
    }
  });

  newLabels.forEach((label) => {
    result = result.map((instruction) =>
      instruction.replace(label, `${symbolTable[label]}`)
    );
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
  let newVariables: string[] = [];

  instructions.forEach((instruction) => {
    const isAInstruction = aInstruction.test(instruction);
    if (isAInstruction) {
      const aInstruction = getA(instruction);
      const isSymbol = symbol.test(aInstruction);
      if (isSymbol) {
        addSymbolTableEntry(aInstruction, "variable");
        newVariables.push(aInstruction);
      }
    }

    result.push(instruction);
  });

  newVariables.forEach((variable) => {
    result = result.map((instruction) =>
      instruction.replace(variable, `${symbolTable[variable]}`)
    );
  });

  return result;
}
