import React from "react";
import { AnimateSharedLayout, motion } from "framer-motion";
import { Tiptap } from "../core/Tiptap";

const Portal = (props: { text: string }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
  const toggleIsExpanded = () => setIsExpanded(!isExpanded);
  const variants = {
    expanded: {
      width: "auto",
      height: "auto",
      transition: { duration: 0.5 },
    },
    contracted: {
      width: 100,
      height: 20,
      transition: { duration: 0.5 },
    },
  };
  return (
    <>
      <motion.div
        layout
        onClick={toggleIsExpanded}
        whileTap={{ scale: 0.97 }}
        animate={isExpanded ? "expanded" : "contracted"}
        variants={variants}
        style={{
          borderRadius: 15,
          display: "inline-block",
          border: `2px solid #777777`,
          overflow: "hidden",
          padding: 5,
        }}
      >
          testing one two three
          testing one two three
          testing one two three
          testing one two three
          testing one two three
        {/* {
          <div style={{ marginTop: -15, marginBottom: -15 }}>
            <Tiptap content={isExpanded ? props.text : props.text} />
          </div>
        } */}
      </motion.div>
    </>
  );
};

const Portal2 = (props: { text: string }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
  const toggleIsExpanded = () => setIsExpanded(!isExpanded);
  return (
    <>
      <motion.div
        layout
        transition={{
          type: "spring", damping: 16
        }}
        onClick={toggleIsExpanded}
        whileTap={{ scale: 0.96 }}
        style={{
          borderRadius: 15,
          display: "inline-block",
          border: `2px solid #777777`,
          overflow: "hidden",
          width: isExpanded ? undefined : 100,
          height: isExpanded ? undefined : 20,
          padding: 4,
        }}
      >
        {
          <div style={{ marginTop: -15, marginBottom: -15 }}>
            <Tiptap content={isExpanded ? props.text : props.text} />
          </div>
        }
      </motion.div>
    </>
  );
};

export const PortalFree = (props: { children: any, id: string, hideDetail?: boolean, backgroundColor?: string, update?: () => void }) => {
  type Expansion = "Expanded" | "Preview" | "Point"
  const [expansionState, setExpansionState] = React.useState<Expansion>(
    props.hideDetail ? "Point" : "Expanded"
  );
  const cycleExpansionState = () => {
    if (expansionState === "Expanded") setExpansionState("Preview");
    else if (expansionState === "Preview") setExpansionState("Point");
    else if (expansionState === "Point") setExpansionState("Expanded");
  };
  const handleChildClick = (e: any) => {
    e.stopPropagation();
    cycleExpansionState();
    console.log('child');
  }

  return (
    <motion.div
      id={props.id}
      drag
      dragConstraints={{ left: 10, right: 10, top: 10, bottom: 10 }}
      layout
      transition={{
        type: "spring",
        damping: 16,
      }}
      onUpdate={
        props.update
          ? () => {
              props.update!();
            }
          : undefined
      }
      onClick={handleChildClick}
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: 17,
        display: "inline-block",
        border: `2px solid #777777`,
        overflow: "hidden",
        width:
          expansionState === "Expanded"
            ? undefined
            : expansionState === "Preview"
            ? 100
            : 10,
        height:
          expansionState === "Expanded"
            ? undefined
            : expansionState === "Preview"
            ? 20
            : 10,
        padding: expansionState === "Point" ? undefined : 4,
      }}
    >
      <AnimateSharedLayout>
        {!(expansionState === "Point") && props.children}
      </AnimateSharedLayout>
    </motion.div>
  );
};



const truncate = (input: string) =>
  input.length > 5 ? `${input.substring(0, 5)}...` : input;

const PortalExample = () => {
  return (
    <AnimateSharedLayout>
      <Portal
        text={
          "The (state of) vacancy should be brought to the utmost degree, and that of stillness guarded with unwearying vigour. All things alike go through their processes of activity, and (then) we see them return (to their original state). When things (in the vegetable world) have displayed their luxuriant growth, we see each of them return to its root. This returning to their root is what we call the state of stillness; and that stillness may be called a reporting that they have fulfilled their appointed end. The report of that fulfilment is the regular, unchanging rule. To know that unchanging rule is to be intelligent; not to know it leads to wild movements and evil issues. The knowledge of that unchanging rule produces a (grand) capacity and forbearance, and that capacity and forbearance lead to a community (of feeling with all things). From this community of feeling comes a kingliness of character; and he who is king-like goes on to be heaven-like. In that likeness to heaven he possesses the Dao. Possessed of the Dao, he endures long; and to the end of his bodily life, is exempt from all danger of decay."
        }
      />
      <Portal2
        text={
          "The (state of) vacancy should be brought to the utmost degree, and that of stillness guarded with unwearying vigour. All things alike go through their processes of activity, and (then) we see them return (to their original state). When things (in the vegetable world) have displayed their luxuriant growth, we see each of them return to its root. This returning to their root is what we call the state of stillness; and that stillness may be called a reporting that they have fulfilled their appointed end. The report of that fulfilment is the regular, unchanging rule. To know that unchanging rule is to be intelligent; not to know it leads to wild movements and evil issues. The knowledge of that unchanging rule produces a (grand) capacity and forbearance, and that capacity and forbearance lead to a community (of feeling with all things). From this community of feeling comes a kingliness of character; and he who is king-like goes on to be heaven-like. In that likeness to heaven he possesses the Dao. Possessed of the Dao, he endures long; and to the end of his bodily life, is exempt from all danger of decay."
        }
      />
      {/* <PortalFree>Hello awesome world</PortalFree> */}
    </AnimateSharedLayout>
  );
};
