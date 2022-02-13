import { named, rgx } from "./regEx.ts";
/**
 * Match a symbol pattern e.g $varName. Must not start with a digit.
 * : _ $ . also allowed
 */
const symbolStartSet = /A-z\$\.:_/;
const symbolRestSet = rgx`${symbolStartSet}\d`;
export const symbol = rgx`([${symbolStartSet}][${symbolRestSet}]+)`;
export const constant = /\d+/;

/**
 * Match an A instruction
 */
export const aInstruction = rgx`^@${
  named(rgx`${symbol}|${constant}`, "instruction")
}$`;
/**
 * Match a label instruction e.g (LOOP)
 * Uppercase word
 */
export const label = rgx`^\\(${
  named(rgx`${symbol}|${constant}`, "label")
}\\)$`;

export const dest = named(/(A|M|D|null){0,3}/, 'dest');
export const comp = named(/((0|1|-1)|(\!|-)?(A|M|D))|(A|M|D)(-|\+|\&|\|)(A|M|D|1)/, 'comp');
export const jump = named(/null|J([A-Z]{2})/, 'jump');

export const cInstructionComposed = rgx
  `^(${dest}?=)?${comp}?(;(?<=;)${jump})?$`;

export const escapeRegex = (s: string) => s.replace(/(?=\W)/g, "\\");
