import { ALL_SYMBOLS, MAX_SYMBOL_LENGTH, SYMBOL_VALUES, SymbolValue } from "../../../data/programSymbols";
import { TokenType } from "./enums";
import Token, { Literal } from "./Token";

export default class Scanner {
    private readonly program: string;
    private readonly tokens: Token[] = [];
    private readonly typesMap = new Map<SymbolValue, TokenType>([
        /* Special symbols */
        [SymbolValue.EXPRESSION, TokenType.EXP],
        [SymbolValue.NEGATIVE, TokenType.NEGATIVE],
        [SymbolValue.COMMA, TokenType.COMMA],
        [SymbolValue.M_PLUS, TokenType.M_PLUS],
        [SymbolValue.M_MINUS, TokenType.M_MINUS],
        [SymbolValue.TO_POLAR, TokenType.TO_POLAR],
        [SymbolValue.TO_COMPLEX, TokenType.TO_COMPLEX],
        [SymbolValue.RANDOM, TokenType.RANDOM],
        [SymbolValue.SEMICOLON, TokenType.SEMICOLON],
        [SymbolValue.INPUT, TokenType.INPUT],
        [SymbolValue.COLON, TokenType.COLON],
        [SymbolValue.DISPLAY, TokenType.DISPLAY],
        /* General Symbols */
        [SymbolValue.EXECUTE, TokenType.EXECUTE],
        [SymbolValue.DEGREE, TokenType.DEGREE],
        /* Operators */
        [SymbolValue.PLUS, TokenType.PLUS],
        [SymbolValue.MINUS, TokenType.MINUS],
        [SymbolValue.MULTIPLY, TokenType.MULTIPLY],
        [SymbolValue.DIVIDE, TokenType.DIVIDE],
        [SymbolValue.FRACTION, TokenType.FRACTION],
        [SymbolValue.INVERSE, TokenType.INVERSE],
        [SymbolValue.SQUARE, TokenType.SQUARE],
        [SymbolValue.CUBE, TokenType.CUBE],
        [SymbolValue.X_POWER, TokenType.X_POWER],
        [SymbolValue.FACTORIAL, TokenType.FACTORIAL],
        [SymbolValue.COMPLEX_ARGUMENT, TokenType.COMPLEX_ARGUMENT],
        [SymbolValue.PERCENT, TokenType.PERCENT],
        [SymbolValue.PERMUTATION, TokenType.PERMUTATION],
        [SymbolValue.COMBINATION, TokenType.COMBINATION],
        [SymbolValue.ASSIGN, TokenType.ASSIGN],
        /* Functions */
        [SymbolValue.SQRT, TokenType.SQRT],
        [SymbolValue.LOG, TokenType.LOG],
        [SymbolValue.LN, TokenType.LN],
        [SymbolValue.SIN, TokenType.SIN],
        [SymbolValue.COS, TokenType.COS],
        [SymbolValue.TAN, TokenType.TAN],
        [SymbolValue.CUBE_ROOT, TokenType.CUBE_ROOT],
        [SymbolValue.X_ROOT, TokenType.X_ROOT],
        [SymbolValue.TEN_X_POWER, TokenType.TEN_X_POWER],
        [SymbolValue.E_X_POWER, TokenType.E_X_POWER],
        [SymbolValue.ARC_SIN, TokenType.ARC_SIN],
        [SymbolValue.ARC_COS, TokenType.ARC_COS],
        [SymbolValue.ARC_TAN, TokenType.ARC_TAN],
        [SymbolValue.ABS, TokenType.ABS],
        [SymbolValue.POLAR, TokenType.POLAR],
        [SymbolValue.REC, TokenType.REC],
        [SymbolValue.RND, TokenType.RND],
        [SymbolValue.ARGUMENT, TokenType.ARGUMENT],
        [SymbolValue.CONJUGATE, TokenType.CONJUGATE],
        /* Parentheses */
        [SymbolValue.LEFT_PARENTHESIS, TokenType.LEFT_PARENTHESIS],
        [SymbolValue.RIGHT_PARENTHESIS, TokenType.RIGHT_PARENTHESIS],
        /* Logical Keywords */
        [SymbolValue.IF, TokenType.IF],
        [SymbolValue.THEN, TokenType.THEN],
        [SymbolValue.ELSE, TokenType.ELSE],
        [SymbolValue.IF_END, TokenType.IF_END],
        [SymbolValue.FOR, TokenType.FOR],
        [SymbolValue.TO, TokenType.TO],
        [SymbolValue.STEP, TokenType.STEP],
        [SymbolValue.NEXT, TokenType.NEXT],
        [SymbolValue.BREAK, TokenType.BREAK],
        [SymbolValue.WHILE, TokenType.WHILE],
        [SymbolValue.WHILE_END, TokenType.WHILE_END],
        [SymbolValue.GOTO, TokenType.GOTO],
        [SymbolValue.LABEL, TokenType.LABEL],
        [SymbolValue.GTE, TokenType.GTE],
        [SymbolValue.LTE, TokenType.LTE],
        [SymbolValue.GT, TokenType.GT],
        [SymbolValue.LT, TokenType.LT],
        [SymbolValue.ARROW, TokenType.ARROW],
        [SymbolValue.EQ, TokenType.EQ],
        [SymbolValue.NEQ, TokenType.NEQ],
    ]);
    private start: number = 0;
    private current: number = 0;
    private segment: number = 1;

    constructor(program: string) {
        this.program = program;
    }

    public scan(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOP, "", null, this.segment));
        return this.tokens;
    }

    private static error(segment: number, message: string): void {
        throw new Error(
            `Error at segment ${segment}, ${message}`
        );
    }

    private isAtEnd(): boolean {
        return this.current >= this.program.length;
    }

    private isDigit(c: string): boolean {
        switch (c) {
            case SYMBOL_VALUES.NUMBER.ONE:
            case SYMBOL_VALUES.NUMBER.TWO:
            case SYMBOL_VALUES.NUMBER.THREE:
            case SYMBOL_VALUES.NUMBER.FOUR:
            case SYMBOL_VALUES.NUMBER.FIVE:
            case SYMBOL_VALUES.NUMBER.SIX:
            case SYMBOL_VALUES.NUMBER.SEVEN:
            case SYMBOL_VALUES.NUMBER.EIGHT:
            case SYMBOL_VALUES.NUMBER.NINE:
            case SYMBOL_VALUES.NUMBER.ZERO:
                return true;
            default:
                return false;
        }
    }

    private isVariable(c: string): boolean {
        switch (c) {
            case SYMBOL_VALUES.VARIABLE.A:
            case SYMBOL_VALUES.VARIABLE.B:
            case SYMBOL_VALUES.VARIABLE.C:
            case SYMBOL_VALUES.VARIABLE.D:
            case SYMBOL_VALUES.VARIABLE.X:
            case SYMBOL_VALUES.VARIABLE.M:
            case SYMBOL_VALUES.VARIABLE.ANSWER:
                return true;
            default:
                return false;
        }
    }

    private isConstant(c: string): boolean {
        switch (c) {
            case SYMBOL_VALUES.CONSTANT.PI:
            case SYMBOL_VALUES.CONSTANT.E:
            case SYMBOL_VALUES.CONSTANT.I:
                return true;
            default:
                return false;
        }
    }

    private scanToken(): void {
        const c = this.advance();

        if (c === " ") return; // Ignore whitespace

        let matched_symbol: SymbolValue | null = null;

        for (let i = MAX_SYMBOL_LENGTH - 1; i >= 0; i--) {
            const symbol = i ? c + this.peek(i) : c;
            if (ALL_SYMBOLS.includes(symbol as SymbolValue)) {
                matched_symbol = symbol as SymbolValue;
                this.current += i; // Move the current index forward by the length of the symbol
                break;
            }
        }

        if (matched_symbol === null) {
            Scanner.error(this.segment, `Unexpected character: ${c + this.peek(4)}`);
            return;
        }

        const tokenType = this.typesMap.get(matched_symbol);
        if (tokenType) {
            this.addToken(tokenType);
        } else {
            if (matched_symbol.length === 1) {
                const isDecimalStartingNumber =
                    c === SYMBOL_VALUES.SPECIAL.DECIMAL &&
                    this.isDigit(this.peek());

                if (this.isDigit(c) || isDecimalStartingNumber) {
                    this.scanNumber();
                } else if (this.isVariable(c)) {
                    this.addToken(TokenType.VARIABLE, c);
                } else if (this.isConstant(c)) {
                    this.addToken(TokenType.CONSTANT, c);
                } else if (this.peek() === SYMBOL_VALUES.SPECIAL.COLON) {
                    this.segment++;
                }
            }
        }
    }

    private advance(): string {
        this.current++;
        return this.program[this.current - 1];
    }

    private addToken(type: TokenType, literal: Literal = null): void {
        const lexeme = this.program.substring(this.start, this.current);
        this.tokens.push(new Token(type, lexeme, literal, this.segment));
    }

    private peek(length: number = 1): string {
        if (this.current + length >= this.program.length) {
            return this.program.substring(this.current, this.program.length);
        }
        return this.program.substring(this.current, this.current + length);
    }

    private scanNumber(): void {
        while (this.isDigit(this.peek())) this.advance();
        if (this.peek() === SYMBOL_VALUES.SPECIAL.DECIMAL) {
            this.advance(); // consume the decimal point
            while (this.isDigit(this.peek())) this.advance();
        }

        const value = this.program.substring(this.start, this.current);
        this.addToken(TokenType.NUMBER, parseFloat(value));
        // TODO: Create custom float class to simulate calculator float
    }
}
