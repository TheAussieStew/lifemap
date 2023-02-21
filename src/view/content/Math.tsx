import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import MathView, { MathViewRef } from "react-math-view"
import { BoxedExpression, ComputeEngine } from '@cortex-js/compute-engine';
import { DisplayLens, EvaluationLens, Latex, MathEquation, MathJSON, MathLens } from '../../core/Model';
import { RichText } from '../../core/RichText';
import { MathfieldElement, convertLatexToAsciiMath, convertLatexToMathMl, convertLatexToSpeakableText} from 'mathlive';


export const Math = (props: { equationString: Latex, lenses: [DisplayLens, EvaluationLens] }) => {
    const ref = React.useRef<MathViewRef>(null)
    const toggleKeyboard = useCallback(
        () => ref.current?.executeCommand("toggleVirtualKeyboard"),
        [ref]
    )

    const ce = new ComputeEngine();
    const [equationString, setEquationString] = React.useState(props.equationString || "");

    let expression: BoxedExpression = ce.parse(equationString)
    let outputEquationString = ""

    // Configure evaluation mode
    switch (props.lenses[1]) {
        case "identity":
            break;
        case "evaluate":
            expression = expression.evaluate();
            break;
        case "simplify":
            expression = expression.simplify();
            break;
        case "numeric":
            expression = expression.N();
            break;
    }

    // Check display lens to determine which format to display output
    // https://cortexjs.io/mathlive/guides/static/
    // Convert to string
    switch (props.lenses[0]) {
        case "latex":
            // Use props.equation and feed into RichText view
            // Or try and activate latex editing mode
            outputEquationString = expression.latex;
            
            break;
        case "linear":
            outputEquationString = convertLatexToAsciiMath(expression.latex)
            break;
        case "mathjson":
            outputEquationString = expression.toString()
            console.log("o", outputEquationString)

            break;
        case "natural":
            // N/A
            outputEquationString = expression.latex.toString();

            break;
        default:
            break;
    }

    return (
        <>
            {
                {
                    'latex':
                        <RichText
                            text={outputEquationString}
                            lenses={["text"]}
                        />,
                    'natural': 
                        <MathView
                            readOnly={props.lenses[1] !== "identity"}
                            style={{
                                fontSize: 25,
                                fontFamily: "SF Pro",
                                display: "inline-block",
                            }}
                            value={outputEquationString}
                            ref={ref}
                        />,
                    'linear': 
                        <RichText
                            text={outputEquationString}
                            lenses={["code"]}
                        />,
                    'mathjson':
                        <RichText
                            text={outputEquationString}
                            lenses={["code"]}
                        />,
                }[props.lenses[0]]
            }
        </>
    )
}

export const MathNaturalExample = () => {
    const computation = `10 * 12`
    const quadraticFormula = String.raw`x=\frac{-b\pm \sqrt{b^2-4ac}}{2a}`

    let equationString = computation;
    return (
        <Math equationString={equationString} lenses={["natural", "numeric"]} />
    )
}