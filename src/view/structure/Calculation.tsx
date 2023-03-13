import React from 'react'
import { motion } from 'framer-motion'
import { DisplayLens, EvaluationLens, Latex } from '../../core/Model';
import { Math } from '../content/Math';

export type GroupLenses = "verticalArray";

export const Calculation = (props: { equationString: string, lenses: [DisplayLens, EvaluationLens] }) => {
    let [equationString, setEquationString] = React.useState<Latex>(props.equationString);
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
            <Math equationString={equationString} lenses={["natural", "identity"]} onChange={(change) => {
            } }/>
            <Math equationString={equationString} lenses={props.lenses} onChange={(change) => {
            } }/>
        </motion.div>
    );
}

export const GroupExample = () => {
    const equationString = ``
    return (
        <Calculation equationString={equationString} lenses={['natural', 'numeric']}/>
    )
}