# Progex
(Under development)  
The All-in-one tool for Calculator Programs. Designed for Casio fx-50fh ii.

## Current Features
* View preset programs in a modern interface
* View guides for inputting different tokens on calculator
* Run calculator programs in the interpreter workbench
* Inspect interpreter outputs, memory variables, tokens, statements and statistics state

## Planned Features
* Transpile calculator program into JavaScript/Python-style pseudocode
* Create program snippets and share
* More preset programs, sample data and guidance on usage

# Preview
The preview is taken with the built version for commit [f48554b](https://github.com/sayatodev/progex/commit/f48554b4206a4dfd7ab284ae5481eee4f5572722). The interface may have been updated afterwards.
![image](https://github.com/user-attachments/assets/53cec0ad-8f56-4e00-aa90-2ef5dd7f6e5f)

### The interpreter
The interpreter is highly influenced by [Crafting Interpreters](https://craftinginterpreters.com/) ([Github](https://github.com/munificent/craftinginterpreters)), which has the code licensed under MIT. [See original license](https://github.com/munificent/craftinginterpreters?tab=License-1-ov-file)

---

#### Latest status
The current interpreter is no longer just a parser demo. The runtime now executes multi-statement calculator programs with control flow, memory, statistics data entry and complex-number operations. The repository currently includes `10` WebCal-based regression tests in [tests/interpreter-webcal.test.ts](/C:/Users/user/code/main/progex/tests/interpreter-webcal.test.ts) covering real programs such as simultaneous equations, trapezoidal integration, weighted statistics and cubic-equation routines.

The frontend at [src/app/interpreter/page.tsx](/C:/Users/user/code/main/progex/src/app/interpreter/page.tsx) is a workbench for the current runtime. It supports:

- Multiline program editing, normalized into calculator-style `:` segments
- Automatic input slot detection from `?`
- Runtime configuration for execution mode, angle mode and final-result emission
- Live display outputs
- Post-run inspection of `A/B/C/D/X/Y/M`, final `Ans`, token stream, parsed statement kinds and statistics dataset

#### Implemented language/runtime features
- Arithmetic: `+`, `-`, `×`, `÷`, fraction `┘`, `EXP`, unary sign, implicit multiplication
- Variables/constants: `A`, `B`, `C`, `D`, `X`, `Y`, `M`, `Ans`, `Ran#`, `π`, `𝓮`, `𝒾`
- Input and assignment: `?`, `→`, `M+`, `M-`
- Unary operations: inverse, square, cube, factorial, percent, degree marker
- Binary operations: power, root, permutation, combination, comparisons, equality
- Functions: `Abs`, `Pol`, `Rec`, `Rnd`, `arg`, `Conjg`, `sin`, `cos`, `tan`, inverse trig, `log`, `ln`, `√`, `∛`, `10^`, `e^`
- Complex-number support: complex literals, `;`, `▶a+b𝒾`, `▶r∠θ`, `∠`
- Control flow: `=>`, `If` / `Then` / `Else` / `IfEnd`, `For` / `To` / `Step` / `Next` / `Break`, `While` / `WhileEnd`, `Goto`, `Lbl`
- Program structure: `:`, `◢`, parentheses, omitted closing parenthesis handling around several statement terminators
- Statistics commands: `ClrStat`, `FreqOn`, `DT`, `Σx`, `Σy`, `n`, `maxX`, `maxY`
- Memory/system commands: `ClrMemory`

#### Known gaps
- Inline mode-switch commands are not fully wired from source code tokens yet. The workbench can seed execution mode and regression mode through UI configuration, but calculator-source mode commands are not fully exposed.
- `EXE` is tokenized but does not currently drive distinct runtime behavior.
- The frontend is still a developer-facing workbench, not a polished calculator keypad or step debugger.
