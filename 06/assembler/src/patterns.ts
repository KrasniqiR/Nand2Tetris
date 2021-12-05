/**
 * Match a symbol pattern e.g $varName. Must not start with a digit. 
 * : _ $ . also allowed
 */
const symbol =  /([\w$\.:][\w$\.\d:]+)/;
/**
 * Match a comment
 * Line stating with //
 */
const commment = /^(\/){2}.*/;
/**
 * Match an A instruction
 * Symbol or number starting with @
 */
const aInstruction = /@(\d+|)/
/**
 * Match a label instruction e.g (LOOP)
 * Uppercase word
 */
const label = /\(([A-Z]+)\)/;
/**
 * Match a JUMP instruction
 * Binding ; JUMP condition
 */
const jmp = /(\d+|[A-Z]+);([A-Z]+)/;
/**
 * Match a C instruction
 * A = !A (!-)
 * AMD=A+D (+-|&)
 */
const comp = /(A|M|D)=(((\!|-)(A|M|D))|(A|M|D)(-|\+|\&|\|)(A|M|D))/;