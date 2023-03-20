import React from "react";
import { QiStoreContext } from "../backend/QiStore";
import { QiT, ShenT } from "../core/Model";
import RichText from "./content/RichText";

// Handles different views of a single qi
// This view is the equivalent of a single window in the app and design
export const QiView = (props: { qi: QiT | ShenT }) => {
  let qi = React.useContext(QiStoreContext)

  // Create a Lens selector
  const Lens = () => {
    switch (typeof props.qi.type) {
      case 'string':
        return <RichText
          qi={qi}
          text={props.qi.information}
          lenses={["text"]}
          onChange={(change) => { 
            console.log(change) 
          }}
        />;
      // case 'maths':
      //     <Math equationString={props.qi.information} lenses={["natural", "numeric"]} onChange={function (change: string | JSONContent): void {
      //       //
      //     } }/>
      default:
        return <>Empty</>;
    }
  };

  return (
    <>
      <Lens />
    </>
  );
};