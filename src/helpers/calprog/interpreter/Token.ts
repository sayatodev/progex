import { TokenType } from "./enums";

export type Literal = number | string | null | undefined;
export default class Token {
    public readonly type: TokenType;
    public readonly lexeme: string;
    public readonly literal: Literal;
    public readonly segment: number;
    public constructor(
        type: TokenType,
        lexeme: string,
        literal: Literal,
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