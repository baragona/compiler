# goal

make a compiler for a C-like language
that directly emits assembly code

make it easy to add new asm targets.
able to emit natively on linux x86_64, linux arm, macos x64/arm, WASM

An easy testbed compiler for my chip designs.

use syscalls on linux, and libSystem on macos

# run

npm run start

# todo

- add variables
- add assignment
- add if
- add else
- add booleans and boolean operators
- add number comparison
- add while
- add for
- add functions
- add return

- add linux asm targets
- call system calls
- add wasm targets
- add macos asm targets

- primitive types:
- uint8/16/32/64 int8/16/32/64
- float32/64
