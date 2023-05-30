import React from 'react'
import { motion } from 'framer-motion'
import { DisplayLens, EvaluationLens, Latex, MathsLoupe, MathsLoupeC } from '../../core/Model';
import { Math } from '../content/Math';
import { Qi } from '../../core/Qi';

export type GroupLenses = "verticalArray";

export const Calculation = (props: { equationString: string, loupe: MathsLoupe}) => {
    let [equationString, setEquationString] = React.useState<Latex>(props.equationString);
    let identityLoupe = new MathsLoupeC()

    React.useEffect(() => {
        console.log("updated eq", equationString)
      }, [equationString]);


    return (
        <motion.div
            layoutId="calculation"
            className="calculation"
            style={{
                minHeight: 50,
                borderRadius: `10px`,
                border: `2px solid var(--Light_Grey, #dddddd)`,
                boxShadow: `0px 0.6032302072222955px 0.6032302072222955px -1.25px rgba(0, 0, 0, 0.18), 0px 2.290210571630906px 2.290210571630906px -2.5px rgba(0, 0, 0, 0.15887), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.0625)`,
                padding: `10px`,
                display: "grid"
            }}
        >
            <Qi qiId={"000000"} loupe={identityLoupe} userId={'000000'} />
            <Qi qiId={"000000"} loupe={props.loupe} userId={'000000'} />
        </motion.div>
    );
}

export const CalculationExample = () => {
    const equationString = `1 + 17`
    let evaluationLoupe = new MathsLoupeC()
    evaluationLoupe.selectedEvaluationLens = evaluationLoupe.evaluationLenses.indexOf('numeric')
    return (
        <Calculation equationString={equationString} loupe={evaluationLoupe}/>
    )
}