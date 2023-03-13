import { BoxedExpression } from "@cortex-js/compute-engine";
import { Doc } from 'yjs'
import { MathJsonDictionary } from "@cortex-js/compute-engine/dist/types/math-json/math-json-format";
import { Node } from "@tiptap/react";
import { generateUniqueID } from "../utils/utils";
import { computed, makeObservable, observable } from "mobx";
import * as Y from 'yjs'

// Shen represents the store that holds all other Qi
// It's similar to the root and subdocuments model referenced in Y.js 
export type ShenT = QiT

export type QiId = string;
export type QiT = {
    information: Doc, // Just the Doc itself
    id: QiId, // Just use the Doc.guid
    // userId: string, // Ignore user authentication for now
    type: Types, // ???
    relations: Set<QiId>, // Just parse the doc for relations
    // maybe caching for calculations
}
export class QiC implements QiT {
    information: Doc = new Y.Doc();
    type: Types = "";

    constructor() {
        makeObservable(this, {
            information: observable,
            id: computed,
            type: observable,
            relations: computed
        })
    }

    get id() {
        return this.information.guid 
    }

    get relations() {
        return this.information.getSubdocGuids()
    }
}
export class QiC_2 implements QiT {
    information: Doc = new Y.Doc();
    id: QiId = this.information.guid;
    type: Types = "";
    relations: Set<QiId> = this.information.getSubdocGuids()
}

export type QiT_2 = Doc

export type Types = Content | Structure | Reference;

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