let latestROMAddress = 0;
let latestRAMAddress = 15;

export const SymbolTable: Record<string, number> = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,
  SCREEN: 16384,
  KBD: 24576,
};

export function addSymbolTableEntry(symbol: string, type: "instruction" | "variable", value?: number) {
    if (SymbolTable[symbol]) throw new Error(`${symbol} already exists.`);

    if (type === "instruction") {
      SymbolTable[symbol] = value ?? 0;
      latestROMAddress = SymbolTable[symbol];
    } else if (type === "variable") {
      SymbolTable[symbol] = ++latestRAMAddress;
    }
}