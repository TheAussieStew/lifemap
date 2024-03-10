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
import React, { useEffect } from "react";
import { Node as ProseMirrorNode, Slice } from "prosemirror-model";
import { debounce } from "lodash";
import { Grip } from "../content/Grip";
import { Plugin, PluginKey } from "prosemirror-state";

const REGEX_BLOCK_TILDE = /(^~(.+?)~)/;
const sharedBorderRadius = 15;

/**
 * Get JSON representation of a Quanta referenced by ID
 * @param quantaId - the quantaId to search for
 * @param doc - the ProseMirrorNode
 * @returns - JSON content (if quanta was found)
 */
const getQuantaJSON = (
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

const PortalView = (props: NodeViewProps) => {
  const { referencedQuantaId, id } = props.node.attrs;
  const updateContent = () => {
    let quantaJSON = getQuantaJSON(referencedQuantaId, props.editor.state.doc);

    if (!quantaJSON) {
      quantaJSON = {
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
    if (!pos || quantaJSON.text || quantaJSON.type === "portal") return;

    const initialSelection = props.editor.state.selection;
    console.log("AN:", quantaJSON);
    let chain = props.editor
      .chain()
      .setMeta("fromPortal", true)
      .setNodeSelection(pos)
      .deleteSelection()
      .insertContentAt(pos, {
        type: "portal",
        attrs: {
          id: `${Math.random().toString(36).substring(2, 9)}`,
          referencedQuantaId,
        },
        content: [quantaJSON],
      });

    if (isNodeSelection(initialSelection)) {
      chain = chain.setNodeSelection(initialSelection.$from.pos);
    } else if (isTextSelection(initialSelection)) {
      chain = chain.setTextSelection({
        from: initialSelection.$from.pos,
        to: initialSelection.$to.pos,
      });
    }

    chain.focus().run();
  };

  useEffect(() => {
    updateContent();
  }, [props.editor, referencedQuantaId]);
  useEffect(() => {
    const debouncedUpdateContent = debounce(updateContent, 1000);
    props.editor.on("update", ({ transaction }) => {
      if (transaction.getMeta("fromPortal") || !transaction.docChanged) return;
      debouncedUpdateContent();
    });

    return () => {
      props.editor.off("update", debouncedUpdateContent);
    };
  }, []);

  return (
    <NodeViewWrapper>
      <input
        type="text"
        value={referencedQuantaId}
        onChange={(event) => {
          props.updateAttributes({
            referencedQuantaId: event.target.value,
          });
        }}
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
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
};

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
    return ReactNodeViewRenderer(PortalView);
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("portal"),
        filterTransaction(tr) {
          if (tr.docChanged) {
            if (tr.getMeta("fromPortal")) return true;

            let allowTransaction = true;

            const newPortals = new Map<string, ProseMirrorNode>();

            // Get all portals from the updated doc
            tr.doc.descendants((descendant) => {
              if (descendant.type.name === "portal") {
                if (descendant.attrs.id) {
                  newPortals.set(descendant.attrs.id, descendant);
                }

                return false;
              }

              return true;
            });
            tr.before.descendants((descendant) => {
              if (descendant.type.name === "portal") {
                const { id } = descendant.attrs;

                if (newPortals.has(id)) {
                  const newPortal = newPortals.get(id);
                  if (newPortal) {
                    // Block transactions changing the content of the portal
                    if (
                      descendant.textContent &&
                      JSON.stringify(newPortal.toJSON()) !==
                        JSON.stringify(descendant.toJSON())
                    ) {
                      allowTransaction = false;
                      return false;
                    }
                  }
                }

                return false;
              }

              return allowTransaction;
            });
            return allowTransaction;
          }
          return true;
        },
      }),
    ];
  },
});

export { PortalExtension };
