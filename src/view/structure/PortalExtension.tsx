import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  nodeInputRule,
} from "@tiptap/react";
import { Node } from "@tiptap/react";
import {
  Editor,
  JSONContent,
  generateHTML,
  isNodeSelection,
  isTextSelection,
  mergeAttributes,
} from "@tiptap/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Fragment, Node as ProseMirrorNode, Slice } from "prosemirror-model";
import { debounce } from "lodash";
import { Grip } from "../content/Grip";
import { Plugin, PluginKey, Transaction } from "prosemirror-state";
import { GroupLenses } from "./Group";
import { getSelectedNodeType, logCurrentLens } from "../../utils/utils";
import { motion } from "framer-motion";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    portal: {
      setLens: (options: {
        lens: string;
      }) => ReturnType;
    }
  }
}

const REGEX_BLOCK_TILDE = /(^~(.+?)~)/;
const sharedBorderRadius = 15;

// Currently they are the same but in future they will diverge
type PortalLenses = GroupLenses

/**
 * Get JSON representation of a Quanta referenced by ID
 * @param quantaId - the quantaId to search for
 * @param doc - the ProseMirrorNode
 * @returns - JSON content (if quanta was found)
 */
const getReferencedQuantaJSON = (
  quantaId: string,
  doc: ProseMirrorNode
): JSONContent | null => {
  let node: ProseMirrorNode | null = null;

  doc.descendants((descendant, _pos, parent) => {
    if (descendant.type.name === "portal") {
      return false;
    }
    if (descendant.attrs.quantaId === quantaId && !node) {
      node = descendant;
    }
  });

  if (node) {
    const jsonContent: JSONContent = (node as ProseMirrorNode).toJSON();

    return jsonContent;
  }

  return null;
};

const inputFocused = { current: false };

const PortalExtension = Node.create({
  name: "portal",
  group: "block",
  content: "block*",
  atom: true,
  addAttributes() {
    return {
      id: {
        default: null,
      },
      referencedQuantaId: {
        default: undefined,
        parseHTML: (element) => {
          return element.getAttribute("data-referenced-quanta-id");
        },
      },
      lens: {
        default: "identity" satisfies PortalLenses,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div",
        attrs: {
          "data-portal": "true",
        },
      },
    ];
  },
  renderHTML({ node }) {
    return [
      "div",
      mergeAttributes({
        "data-portal": "true",
        "data-referenced-quanta-id": node.attrs.referencedQuantaId,
      }),
      0,
    ];
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: REGEX_BLOCK_TILDE,
        type: this.type,
        getAttributes: (match) => {
          return { referencedQuantaId: match[2] || "" };
        },
      }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(
      (props: NodeViewProps) => {
        // On node instantiation, useState will draw from the node attributes
        // If the attributes are updated, this will re-render, therefore this state is always synced with the node attributes
        const [referencedQuantaId, setReferencedQuantaId] = useState(props.node.attrs.referencedQuantaId);

        useEffect(() => {
          const jsonContent = props.node.toJSON();
          console.log("Portal Node JSONContent:", jsonContent);
        }, [props.node]);

        // If the input is updated, this handler is called
        const handleReferencedQuantaIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const newQuantaId = event.target.value;
          setReferencedQuantaId(newQuantaId);
          updateTranscludedContent(newQuantaId);

          setTimeout(() => {
            props.updateAttributes({ referencedQuantaId: event.target.value });
          }, 2000);
        };

        const updateTranscludedContent = useCallback((referencedQuantaId: string) => {
          let referencedQuantaJSON = getReferencedQuantaJSON(referencedQuantaId, props.editor.state.doc);

          // Handle invalid referenced quanta id input
          if (!referencedQuantaId) {
            referencedQuantaJSON = {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "You need to enter a referenced quanta id, this field is currently empty.",
                },
              ],
            };
          } else if (referencedQuantaJSON === null) {
            // Couldn't find a quanta with that id, possibly invalid
            referencedQuantaJSON = {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Couldn't find referenced quanta. Are you sure the id you're using is a valid one?",
                },
              ],
            };
          }

          const pos = props.getPos();

          // Currently shouldn't support references to text, nor references to other portals
          if (!pos || referencedQuantaJSON.text || referencedQuantaJSON.type === "portal") return;

          // Get the current selection before updating the portal content, so we can restore it after the portal has been updated
          const initialSelection = props.editor.state.selection;

          // Preserve existing 'lens' attribute
          const currentLens = props.node.attrs.lens;

          // Replace the current portal (containing old referenced quanta content) with a new portal 
          // containing the updated referenced quanta content
          let chain = props.editor
            .chain()
            .setMeta("fromPortal", true)
            .setNodeSelection(pos)
            .deleteSelection()
            .insertContentAt(pos, {
              type: "portal",
              attrs: {
                id: `${referencedQuantaId}`,
                referencedQuantaId: referencedQuantaId,
                lens: currentLens, // Preserve the current lens
              },
              content: [referencedQuantaJSON],
            });

          // After updating the portal content, restore the original selection:
          // - If a node was selected, reselect that node at its position
          // - If text was selected, restore the text selection range from start to end position
          // This preserves the user's selection state after the portal update
          if (isNodeSelection(initialSelection)) {
            chain = chain.setNodeSelection(initialSelection.$from.pos);
          } else if (isTextSelection(initialSelection)) {
            chain = chain.setTextSelection({
              from: initialSelection.$from.pos,
              to: initialSelection.$to.pos,
            });
          }

          chain.run();
        }, [props.editor, props.getPos]);

        const handleEditorUpdate = ({ transaction }: { transaction: Transaction }) => {
          if (
            transaction.getMeta("fromPortal") ||
            !transaction.docChanged
          )
            return;

          updateTranscludedContent(referencedQuantaId);
        }

        // Update the transclusion if the referencedQuantaId has changed or if the node has changed
        useEffect(() => {
          props.editor.on("update", handleEditorUpdate);
        
          // Clean up the event listener when the component unmounts
          return () => {
            props.editor.off("update", handleEditorUpdate);
          };
        }, [props.editor, referencedQuantaId, handleEditorUpdate]);

        // Add effect to monitor lens changes
        useEffect(() => {
          console.log("Portal lens changed:", props.node.attrs.lens);
        }, [props.node.attrs.lens]);

        const checkForImportantMention = (node: any): boolean => {
          let hasImportantMention = false;
          
          node.descendants((descendant: any) => {
            if (descendant.type.name === 'mention' && 
                (descendant.attrs.label as string).includes('⭐️ important')) {
              hasImportantMention = true;
            }
          });
          
          return hasImportantMention;
        };

        return (
          <NodeViewWrapper>
            <div contentEditable={false}>
              <input
                type="text"
                value={referencedQuantaId}
                onFocus={() => {
                  inputFocused.current = true;
                }}
                onBlur={() => {
                  inputFocused.current = false;
                }}
                onChange={handleReferencedQuantaIdChange}
                style={{
                  border: "1.5px solid #34343430",
                  borderRadius: sharedBorderRadius,
                  outline: "none",
                  backgroundColor: "transparent",
                  width: `80px`,
                  position: "absolute",
                  zIndex: 1,
                }}
              />
            </div>
            <div
              style={{
                borderRadius: sharedBorderRadius,
                background: `#e0e0e0`,
                position: "relative",
                boxShadow: `inset 10px 10px 10px #bebebe,
                    inset -10px -10px 10px #FFFFFF99`,
                minHeight: 20,
                padding: `11px 15px 11px 15px`,
                marginBottom: 10,
              }}
              contentEditable={false}
            >
              <Grip />
              {(() => {
                // Need to switch all other instances of using "as" to "satisfies"
                switch (props.node.attrs.lens satisfies PortalLenses) {
                  case "identity":
                    return <NodeViewContent node={props.node} />;
                  case "hideUnimportantNodes":
                    return (
                      <div style={{ position: 'relative' }}>
                        <NodeViewContent node={props.node} />
                        {!checkForImportantMention(props.node) && (
                          <motion.div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'black',
                              opacity: 0.8,
                              borderRadius: 10,
                              pointerEvents: "none"
                            }}
                          />
                        )}
                      </div>
                    );
                  default:
                    return <NodeViewContent node={props.node} />;
                }
              })()}
            </div>
          </NodeViewWrapper>
        );
      },
    );
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('portalLensMonitor'),
        appendTransaction: (transactions, oldState, newState) => {
          let modified = false;
          
          transactions.forEach(tr => {
            tr.steps.forEach(step => {
              if (step.toJSON().stepType === 'setNodeAttribute') {
                console.log("Node attribute change detected:", {
                  step: step.toJSON(),
                  oldDoc: oldState.doc.toJSON(),
                  newDoc: newState.doc.toJSON()
                });
                modified = true;
              }
            });
          });
          
          if (modified) {
            console.log("Portal state update:", {
              oldState: oldState.toJSON(),
              newState: newState.toJSON()
            });
          }
          
          return null;
        }
      })
    ];
  },
  addCommands() {
    return {
      setLens: (attributes: { lens: string }) => ({ editor, state, dispatch }) => {
        const { selection } = state;
        const pos = selection.$from.pos;
        const node = state.doc.nodeAt(pos);
        
        if (node && node.type.name === "portal" && dispatch) {
          // Use setNodeMarkup instead of setNodeAttribute
          const tr = state.tr.setNodeMarkup(
            pos,
            null,  // preserve node type
            {
              ...node.attrs,  // preserve existing attributes
              lens: attributes.lens
            }
          );
          
          // Add meta to prevent filtering
          tr.setMeta("fromPortal", true);
          
          dispatch(tr);
          
          // Log the new state after dispatch
          console.log("Lens after update:", {
            newLens: editor.state.doc.nodeAt(pos)?.attrs.lens,
            transaction: { docChanged: tr.docChanged, steps: tr.steps.length }
          });
          
          return true;
        }
        
        return false;
      },
    };
  },
});

export { PortalExtension };
