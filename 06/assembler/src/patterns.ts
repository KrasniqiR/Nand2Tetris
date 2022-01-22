import { or, rExp, source } from "./regEx.ts";

/**
 * Match a symbol pattern e.g $varName. Must not start with a digit.
 * : _ $ . also allowed
 */
export const symbol = /([A-z$\.:][A-z$\.\d:]+)/;

export const constant = /\d+/;

/**
 * Match an A instruction
 * Symbol or number starting with @
 */
export const aInstruction = new RegExp(`@${or(symbol, constant)}`);
/**
 * Match a label instruction e.g (LOOP)
 * Uppercase word
 */
export const label = new RegExp(`\((${or(symbol, constant)})\)`);
/**
 * Match a JUMP instruction
 * Binding ; JUMP condition
 */
export const jmp = /(\d+|[A-Z]+);([A-Z]+)/;

export const dest = /(?<dest>(A|M|D|null){0,3})/;
export const comp =
  /(?<comp>((0|1|-1)|(\!|-)(A|M|D))|(A|M|D)(-|\+|\&|\|)(A|M|D))/;
export const jump = /(?<jump>null|J([A-Z]{2}))/;

export const cInstructionComposed = rExp
  `^(${dest}?=)?${comp}?(;(?<=;)${jump})?$`;

export const variable = /^@(?<variable>[a-zA-Z].*)/;
