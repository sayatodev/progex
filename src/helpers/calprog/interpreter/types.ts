import { TokenType } from "./enums";

// Token types that are used in expressions
export type TermOperator = 
    | TokenType.PLUS
    | TokenType.MINUS

export type FactorOperator =
    | TokenType.MULTIPLY
    | TokenType.DIVIDE
    | TokenType.FRACTION

export type ComparisonOperator =
    | TokenType.GT
    | TokenType.GTE
    | TokenType.LT
    | TokenType.LTE

export type EqualityOperator =
    | TokenType.EQ
    | TokenType.NEQ

export type BinaryOperator =
    | TermOperator
    | FactorOperator
    | ComparisonOperator
    | EqualityOperator

export type UnaryOperator = TokenType.MINUS | TokenType.NEGATIVE | TokenType.PLUS;

// Utility types
export type ErrorName = "SyntaxError" | "RuntimeError" | "StackError" | "MathError"