import { getL } from "./parser.ts";
import { label, variable } from "./patterns.ts";
import { addSymbolTableEntry } from "./symbol_table.ts";

export function preProcess(
  instructions: string[],
  symbolTable: Record<string, number>,
) {
  const formattedInstructions = instructions.map((instruction) =>
    instruction.replaceAll(/\s*/, "")
  );
  const instructionsOmitComments = formattedInstructions.filter((instruction) =>
    instruction.startsWith("//") || instruction === ""
  );
  const formattedProgram = injectSymbols(instructionsOmitComments, symbolTable);
  return formattedProgram;
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
      addSymbolTableEntry(label, "instruction", index + 1);
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

  instructions.forEach((instruction) => {
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

  return symbolInjectedInstructions;
}
