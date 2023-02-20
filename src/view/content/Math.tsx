import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import MathView, { MathViewRef } from "react-math-view"
import { ComputeEngine } from '@cortex-js/compute-engine';
import { DisplayLens, EvaluationLens, Latex, MathJSON, MathLens } from '../../core/Model';
import RichText from '../../core/RichText';


export const Math = (props: { equationString: Latex, lenses: [DisplayLens, EvaluationLens], onChange: (equationString: Latex) => void }) => {
    const ref = React.useRef<MathViewRef>(null)
    const toggleKeyboard = useCallback(
        () => ref.current?.executeCommand("toggleVirtualKeyboard"),
        [ref]
    )

    const ce = new ComputeEngine();
    const [equationString, setEquationString] = React.useState(props.equationString || "");

    const onChange = useCallback((e: React.SyntheticEvent<any, any>) => {
        setEquationString(e.currentTarget.getValue());
        console.log(e.currentTarget.getValue())
        props.onChange(e.currentTarget.getValue());
      }, [props.onChange]);

      React.useEffect(() => {
        // Update 
      }, [equationString]);

    let expression = ce.parse(equationString)
    let outputEquationString = ""

    // Configure evaluation mode
    switch (props.lenses[1]) {
        case "identity":
            expression = expression;
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
    switch (props.lenses[0]) {
        case "latex":
            // Use props.equation and feed into RichText view
            // Or try and activate latex editing mode
            outputEquationString = expression.toString();
            
            break;
        case "linear":
            if (ref.current) {
                outputEquationString = ref.current.getValue('ascii-math');
            }

            break;
        case "mathjson":
            outputEquationString = expression.toJSON().toString();

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
                        <textarea
                            value={outputEquationString}
                            onChange={() => { }}
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
                            onChange={onChange}
                        />,
                    'linear': 
                        <textarea
                            value={outputEquationString}
                            onChange={() => { }}
                        />,
                    'mathjson':
                        <textarea
                            value={outputEquationString}
                            onChange={() => { }}
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
        <Math equationString={equationString} lenses={["natural", "numeric"]} onChange={() => {
            // Update the original equation store on update
            return "lol"
        }} />
    )
}