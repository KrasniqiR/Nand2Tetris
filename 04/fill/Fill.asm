// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
// Solution
// 1. Loop listening for keyboard input
// 2. If input not pressed, white screen
// 3. Else draw pixels

// Full Solution
// 1. Listen for keyboard
// 2. Paint screen
// 3. Listen for not pressed
// 4. Clear screen
// 5. Run program again

//Listen for keyboard
(LOOP)


@SCREEN
D=A
@PixelAddress
//Load Screen address into R1
M=D
@8192
D=A
@PixelAddress
//Add screen addresses
M=M+D

@KBD
D=M

//If pressed, paint
@PAINT
D;JGT
//If not pressed, clear
@CLEAR
D;JEQ

(PAINT)
@32767
D=A

@PixelAddress
A=M
M=D

@PixelAddress
M=M-1

@SCREEN
D=D-A

@PAINT
D;JGE

@LOOP
0;JMP

(CLEAR)
@0
D=A

@PixelAddress
A=M
M=D

@PixelAddress
M=M-1

@SCREEN
D=D-A

@CLEAR
D;JGE

@LOOP
0;JMP