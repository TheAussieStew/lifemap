import { BoxedExpression } from "@cortex-js/compute-engine";
import { MathJsonDictionary } from "@cortex-js/compute-engine/dist/types/math-json/math-json-format";
import { Node } from "@tiptap/react";

export type Types = Content | Structure | Reference;
export type Qi = string;

export type Content = Text | MathEquation
// If we switch from one node to another, the marks and other styling information should be preserved. 
// So the paradigm of viewing information in many different ways isn't really possible
// TODO: This type, shouldn't refer to Node, Node is a way of viewing a type, it should refer to the data inside the schema
// Call this text, not rich text, since the lenses make it rich
export type Text = string
export type MathEquation = Latex | MathJSON | BoxedExpression
export type Latex = string
export type MathJSON = string

export type Structure = Group | Calculation
export type Group = Content[]
export type Calculation = (MathEquation & Portal)

export type Reference = Portal
export type Portal = string

export type Lenses = MathLens | RichTextLens | "Other"

export type MathLens = DisplayLens | EvaluationLens | NotationLens | PrecisionLens | FractionLens | BaseNLens
export type DisplayLens = "latex" | "natural" | "linear" | "mathjson"
export type EvaluationLens = "identity" | "evaluate" | "simplify" | "numeric" 
export type NotationLens = "scientific" | "engineering"
export type PrecisionLens = "15" | "100" | number
export type FractionLens = "simplified" | "mixed" | "decimal"
export type BaseNLens = "hexadecimal" | "decimal" | "octal" | "binary"

export type RichTextLens = TextLens | SectionLens
export type TextLens = "normal" 
export type SectionLens = "code" | "text"