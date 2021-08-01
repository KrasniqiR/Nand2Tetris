// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

// Put your code here.

//Set output to 0
    @R2
    M=0

// If R0=0 or R1=0, run zero branch
    @R0
    D=M
    @ZERO
    D;JEQ    
    @R1
    D=M
    @ZERO
    D;JEQ

    (LOOP)
    @R0
    D=M
    @R2
    M=D+M
    
    @R1
    M=M-1
    D=M
    @LOOP
    D;JGT
    @END
    0;JMP

    (ZERO)
    @R2
    M=0

    (END)


