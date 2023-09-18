import React, { DetailedHTMLProps, HTMLAttributes, useCallback, useEffect, useState, useMemo} from 'react'
import { BoxedExpression, ComputeEngine } from '@cortex-js/compute-engine';
import { DisplayLens, EvaluationLens, MathLens, MathsLoupe, MathsLoupeC, QiC, QiT } from '../../core/Model';
import { RichText } from './RichText';
import { convertLatexToAsciiMath } from 'mathlive';
import { JSONContent } from '@tiptap/react';
import { Qi } from '../../core/Qi';
import { DOMAttributes } from "react";
import { MathfieldElementAttributes } from 'mathlive'
import { Group } from '../structure/Group';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Attrs } from 'prosemirror-model';
import { getMathsLoupeFromAttributes } from '../../utils/utils';
import { simplifyExpression, Step, ChangeTypes, solveEquation} from 'mathsteps';
import axios from 'axios';
import { error } from 'console';
import exp from 'constants';

type CustomElement<T> = Partial<T & DOMAttributes<T>>;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["math-field"]: CustomElement<MathfieldElementAttributes>;
        }
    }
}

export const Math = (props: { equationString: string, nodeAttributes: Attrs, lensDisplay: DisplayLens, lensEvaluation: EvaluationLens, children?: any, updateContent?: (event: any) => void }) => {
    const ce = new ComputeEngine();
    const mathFieldRef = React.useRef<HTMLInputElement>()

    // let [outputEquationString, setOutputEquationString] = React.useState<string>(props.equationString)
    let [stepsArray, setStepsArray] = React.useState<string[]>([""])
    const [isDropdownVisible, setDropdownVisibility] = useState(false);
    const [showingSteps, setShowingSteps] = React.useState<boolean>(false)

    // const hasSimplified = React.useRef(false);
    // const hasEvaluated = React.useRef(false);

    // const useWolfram = React.useRef(false)
    // let teststring = ""

    const [inputValue, setInputValue] = useState<string>('');

    const[equationString, setEquationString] = useState<string>(props.equationString)
    const[outputEquationString, setOutputEquationString] = useState<string>(equationString)


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            console.log("equationString: " + equationString)
            axios.post('http://127.0.0.1:8000/createWolframQuery', { userQuery: inputValue, tex: equationString })
                .then(response => {
                    console.log("response:" + response.data.query)
                    let query = response.data.query
                    axios.post('http://127.0.0.1:8000/solve', { query: query})
                    .then(response => {
                        console.log(response.data.explanation)
                        setStepsArray(response.data.explanation.split('\n'));
                        setEquationString(response.data.result)
                        setShowingSteps(true)

                    }).catch(error => {
                        console.log('Getting solution failed', error);
                    });
                })
                .catch(error => {
                    console.log('Creating phrase failed', error);
                });
        }
    };

    useEffect(() => {
        setEquationString(props.equationString)
    }, [props.equationString]);
   
    useEffect(() => {
        let expression: BoxedExpression = ce.parse(equationString)
        console.log(equationString)
        switch (props.lensDisplay) {
            case "latex":
                setOutputEquationString(expression.latex)
                break;
            case "linear":
                setOutputEquationString(convertLatexToAsciiMath(expression.latex));
                break;
            case "mathjson":
                setOutputEquationString(expression.toString());
                break;
            case "natural":
                setOutputEquationString(expression.latex.toString());
                break;
            default:
                break;
        }
    }, [props.lensDisplay, props.lensEvaluation, equationString]);




    // useEffect(() => {
    //     console.log(outputEquationString);
    // }, [outputEquationString]);

    // console.log('f' + outputEquationString)
    return (
        <motion.div style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between", // This will put space between your components
            // ...other styles
        }}>
            <motion.div style={{
                position: "relative",
                width: "fit-content",
                padding: 5,
                backgroundColor: "#EFEFEF",
                borderRadius: 5,
                boxShadow: `0px 0.6032302072222955px 0.6032302072222955px -1.25px rgba(0, 0, 0, 0.18), 0px 2.290210571630906px 2.290210571630906px -2.5px rgba(0, 0, 0, 0.15887), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.0625)`,
            }}
            >
                <motion.div data-drag-handle
                    onMouseLeave={(event) => {
                        event.currentTarget.style.cursor = "grab";
                    }}
                    onMouseDown={(event) => {
                        event.currentTarget.style.cursor = "grabbing";
                    }}
                    onMouseUp={(event) => {
                        event.currentTarget.style.cursor = "grab";
                    }}
                    style={{ position: "absolute", right: -5, top: 3, display: "flex", flexDirection: "column", cursor: "grab", fontSize: "24px", color: "grey" }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}>
                    ⠿
                </motion.div>
                {
                    {
                        'natural':
                            <math-field style={{ border: 'none' }} ref={mathFieldRef} onInput={(event: any) => {
                                if (props.updateContent) {
                                    props.updateContent(mathFieldRef.current?.value)
                                }
                            }}>
                                {/* TODO: Make this read only */}
                                {outputEquationString}
                            </math-field>,
                        'latex':
                            <math-field style={{ border: 'none' }} ref={mathFieldRef} onInput={(event: any) => {
                                if (props.updateContent) {
                                    props.updateContent(mathFieldRef.current?.value)
                                }
                            }}>
                                {/* TODO: Make this read only */}
                                {outputEquationString}
                            </math-field>,
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
                    }[props.lensDisplay]
                }
                {
                    (props.lensEvaluation === "simplify" || props.lensEvaluation === "evaluate" || showingSteps) &&
                    <motion.div>
                        <button onClick={() => setDropdownVisibility(!isDropdownVisible)}>Show Steps ▼</button>
                        {isDropdownVisible && (
                            <motion.div style={{
                                position: 'absolute',
                                backgroundColor: '#f9f9f9',
                                border: '1px solid #ccc',
                                borderRadius: 5,
                                boxShadow: `0px 0.6032302072222955px 0.6032302072222955px -1.25px rgba(0, 0, 0, 0.18), 0px 2.290210571630906px 2.290210571630906px -2.5px rgba(0, 0, 0, 0.15887), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.0625)`
                            }}>
                                {stepsArray.map((step, index) => {
                                    if (step.includes("$")) {
                                        const latexContent = step.replace(/\$/g, ''); // Remove dollar signs
                                        return (
                                            <div key={index}>
                                                <math-field style={{ border: 'none' }} readOnly>
                                                    {latexContent}
                                                </math-field>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index}>
                                                {step}
                                            </div>
                                        );
                                    }
                                })}
                            </motion.div>
                        )}
                    </motion.div>
                }
            </motion.div>

            <div style={{
                alignSelf: "flex-end",
                marginBottom: "10px"
            }}>
                <input
                    type="text"
                    placeholder="Enter text here"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}// Handle "Enter" key press
                />
            </div>
        </motion.div>
    )
}

export const MathsWithoutQi = (props: { equation: string }) => {
    const [equation, setEquation] = React.useState(props.equation)

    return (
        <div>
            <math-field>
                {equation}
            </math-field>
        </div>
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