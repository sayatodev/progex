import type { SymbolValue } from "@/data/programSymbols/generatedEnums";
import type { TokenType } from "./enums";
import type Token from "./Token";

// Token types that are used in expressions
export type TermOperator = TokenType.PLUS | TokenType.MINUS;

export type FactorOperator =
    | TokenType.MULTIPLY
    | TokenType.DIVIDE
    | TokenType.FRACTION;

export type ComparisonOperator =
    | TokenType.GT
    | TokenType.GTE
    | TokenType.LT
    | TokenType.LTE;

export type EqualityOperator = TokenType.EQ | TokenType.NEQ;

export type BinaryOperator =
    | TermOperator
    | FactorOperator
    | ComparisonOperator
    | EqualityOperator;

export type UnaryOperator =
    | TokenType.MINUS
    | TokenType.NEGATIVE
    | TokenType.PLUS;

export type Identifier = TokenType.CONSTANT | TokenType.VARIABLE;
export type Terminator = TokenType.DISPLAY | TokenType.COLON | TokenType.EOP;
export type VariableName =
    | SymbolValue.A
    | SymbolValue.B
    | SymbolValue.C
    | SymbolValue.D
    | SymbolValue.X
    | SymbolValue.Y
    | SymbolValue.M
    | SymbolValue.RANDOM;
export type ConstantName = SymbolValue.PI | SymbolValue.E;
export type IdentifierName = VariableName | ConstantName | SymbolValue.ANSWER;

export type Value = number;

export type IdentifierToken = Token<Identifier, IdentifierName>;

// Utility types
export type ErrorName =
    | "SyntaxError"
    | "RuntimeError"
    | "StackError"
    | "MathError";
