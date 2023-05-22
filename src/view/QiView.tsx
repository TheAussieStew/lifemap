import React from "react";
import { QiStoreContext } from "../backend/QiStore";
import { QiT, ShenT } from "../core/Model";
import RichText from "./content/RichText";
import { observer } from "mobx-react-lite";

// Handles different views of a single qi
// This view is the equivalent of a single window in the app and design
export const QiView = observer((props: { qi: QiT | ShenT }) => {
  let qi = React.useContext(QiStoreContext)

  // Create a Lens selector
  const Lens = () => {
    console.log("type", qi.informationTypeName)
    switch (qi.informationTypeName) {
      case 'jsonContent':
        return <RichText
          qi={qi}
          text={props.qi.information}
          lenses={["text"]}
          onChange={(change) => { 
            console.log(change) 
          }}
        />;
      default:
        throw Error("Qi does not fall into any existing informationTypes")
    }
  };

  return (
    <>
      <Lens />
    </>
  );
});