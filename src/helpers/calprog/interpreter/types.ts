import type { SymbolValue } from "@/data/programSymbols/generatedEnums";
import { TokenType } from "./enums";
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

export type SignedOperator =
    | TokenType.MINUS
    | TokenType.NEGATIVE
    | TokenType.PLUS;

export type ExponentOperator =
    | TokenType.INVERSE
    | TokenType.SQUARE
    | TokenType.CUBE;

export type CombinatorialOperator =
    | TokenType.PERMUTATION
    | TokenType.COMBINATION;

export type BinaryOperator =
    | TermOperator
    | FactorOperator
    | ComparisonOperator
    | EqualityOperator
    | CombinatorialOperator
    | TokenType.X_POWER
    | TokenType.X_ROOT;

export type UnaryOperator =
    | ExponentOperator
    | TokenType.FACTORIAL
    | TokenType.PERCENT;

export type FunctionIdentifier =
    | TokenType.ABS
    | TokenType.POLAR
    | TokenType.SIN
    | TokenType.COS
    | TokenType.TAN
    | TokenType.ARC_SIN
    | TokenType.ARC_COS
    | TokenType.ARC_TAN
    | TokenType.LOG
    | TokenType.LN
    | TokenType.SQRT
    | TokenType.CUBE_ROOT;

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

export type IdentifierToken = Token<Identifier, IdentifierName>;

/* Utility types */
export type ErrorName =
    | "SyntaxError"
    | "RuntimeError"
    | "StackError"
    | "MathError";

/* Helper types */
type GrowToSize<T, N extends number, A extends T[]> = A["length"] extends N
    ? A
    : GrowToSize<T, N, [...A, T]>;

export type FixedArray<T, N extends number> = GrowToSize<T, N, []>;
