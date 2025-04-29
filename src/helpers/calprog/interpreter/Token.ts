import { type TokenType } from "./enums";
import { Value } from "./Value";

export type Literal = Value | string | null;
export default class Token<
    T extends TokenType = TokenType,
    LexemeT = string,
    LiteralT = Literal
> {
    public readonly type: T;
    public readonly lexeme: LexemeT;
    public readonly literal: LiteralT;
    public readonly segment: number;
    public constructor(
        type: T,
        lexeme: LexemeT,
        literal: LiteralT,
        segment: number
    ) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.segment = segment;
    }

    public toString(): string {
        return `Token ${this.type} ${this.lexeme} ${this.literal}`;
    }
}
