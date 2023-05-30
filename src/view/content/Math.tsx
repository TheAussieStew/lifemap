import React, { useCallback } from 'react'
import MathView, { MathViewRef } from "react-math-view"
import { BoxedExpression, ComputeEngine } from '@cortex-js/compute-engine';
import { MathsLoupe, MathsLoupeC, QiC, QiT } from '../../core/Model';
import { RichText } from './RichText';
import { convertLatexToAsciiMath} from 'mathlive';
import { JSONContent } from '@tiptap/react';
import { Qi } from '../../core/Qi';

export const Math = (props: { qi: QiT, equationString?: string, loupe: MathsLoupe, onChange: (change: string | JSONContent) => void }) => {
    const ref = React.useRef<MathViewRef>(null)
    const text = props.qi.informationText

    const ce = new ComputeEngine();
    const [equationString, setEquationString] = React.useState(text|| "");

    let expression: BoxedExpression = ce.parse(equationString)
    let outputEquationString = ""

    // Configure evaluation mode
    switch (props.loupe.evaluationLenses[props.loupe.selectedEvaluationLens]) {
        case "identity":
            break;
        case "evaluate":
            // @ts-ignore
            expression = expression.evaluate();
            break;
        case "simplify":
            // @ts-ignore
            expression = expression.simplify();
            break;
        case "numeric":
            // @ts-ignore
            expression = expression.N();
            break;
    }

    // Check display lens to determine which format to display output
    // https://cortexjs.io/mathlive/guides/static/
    // Convert to string
    switch (props.loupe.displayLenses[props.loupe.selectedDisplayLens]) {
        case "latex":
            // Use props.equation and feed into RichText view
            // Or try and activate latex editing mode
            // @ts-ignore
            outputEquationString = expression.latex;
            
            break;
        case "linear":
            // @ts-ignore
            outputEquationString = convertLatexToAsciiMath(expression.latex)
            break;
        case "mathjson":
            outputEquationString = expression.toString()

            break;
        case "natural":
            // N/A
            // @ts-ignore
            outputEquationString = expression.latex

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
                            onChange={props.onChange}
                        />,
                    'natural': 
                        <MathView
                            readOnly={props.loupe.evaluationLenses[props.loupe.selectedEvaluationLens] !== "identity"}
                            style={{
                                fontSize: 25,
                                fontFamily: "SF Pro",
                                display: "inline-block",
                            }}
                            value={outputEquationString}
                            onChange={(e: React.SyntheticEvent<any, any>) => {
                                // console.log('value', e.currentTarget.getValue('spoken'), ref.current?.getValue('latex'));
                                console.log(e.currentTarget.getValue('latex'))
                                props.onChange(e.currentTarget.getValue('latex'))
                            }}
                            ref={ref}
                        />,
                    'linear': 
                        <RichText
                            text={outputEquationString}
                            lenses={["code"]}
                            onChange={props.onChange}
                        />,
                    'mathjson':
                        <RichText
                            text={outputEquationString}
                            lenses={["code"]}
                            onChange={props.onChange}
                        />,
                }[props.loupe.displayLenses[props.loupe.selectedDisplayLens]]
            }
        </>
    )
}

export const MathNaturalExample = () => {
    const computation = `10 * 12`
    const quadraticFormula = String.raw`x=\frac{-b\pm \sqrt{b^2-4ac}}{2a}`
    let qi: QiT = new QiC()
    // qi.informationTypeName = 'maths' 
    let mathsLoupe = new MathsLoupeC()
    let equationString = computation;
    const content = `
    $$
        \frac{1}{2}
    $$
    `
    const parsedContent = `
    <math-live>
        \frac{1}{2}
    </math-live>
    `
    return (
        <Math qi={qi} equationString={equationString} loupe={mathsLoupe} onChange={() => { return }} />
    )
}

export const MathWithQiExample = () => {
    const computation = `10 * 12`
    const quadraticFormula = String.raw`x=\frac{-b\pm \sqrt{b^2-4ac}}{2a}`
    let qi: QiT = new QiC()
    qi.informationTypeName = "latex"
    let mathsLoupe = new MathsLoupeC()
    let equationString = computation;
    return (
        <Qi qiId={'000000'} userId={'000000'} loupe={mathsLoupe} />
    )
}