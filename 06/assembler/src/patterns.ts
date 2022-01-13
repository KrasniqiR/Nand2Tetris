/**
 * Match a symbol pattern e.g $varName. Must not start with a digit.
 * : _ $ . also allowed
 */
export const symbol = /([\w$\.:][\w$\.\d:]+)/;
/**
 * Match a comment
 * Line stating with //
 */
export const commment = /^(\/){2}.*/;
/**
 * Match an A instruction
 * Symbol or number starting with @
 */
export const aInstruction = /@((\d|[A-z]))+/;
/**
 * Match a label instruction e.g (LOOP)
 * Uppercase word
 */
export const label = /\(([A-Z]+)\)/;
/**
 * Match a JUMP instruction
 * Binding ; JUMP condition
 */
export const jmp = /(\d+|[A-Z]+);([A-Z]+)/;
/**
 * Matches dest, comp and jump fields with named capture groups of comp instruction.
 */
export const cInstruction =
  /^((?=)(?<dest>(A|M|D|null){0,3})?=)?(?<comp>((0|1|-1)|(\!|-)(A|M|D))|(A|M|D)(-|\+|\&|\|)(A|M|D))?(;(?<=;)(?<jump>null|J([A-Z]{2})))?$/;
