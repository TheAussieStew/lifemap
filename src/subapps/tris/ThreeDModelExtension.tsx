import React, { useState } from 'react';
import { Node, nodeInputRule, NodeViewProps } from '@tiptap/core';
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
} from '@tiptap/react';
import { Generic3DModel } from './ThreeDModel'; // Adjust the import path as needed

export const threeDModelInputRegex = /--model--$/;

export const ThreeDModelExtension = Node.create({
  name: 'three-d-model',
  group: 'block',
  inline: false,
  atom: true,
  selectable: false,
  draggable: true,
  addAttributes() {
    return {
      modelPath: {
        default: 'nelson-statue',
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'three-d-model',
        getAttrs: (element: HTMLElement | string) => {
          return {
              modelPath: (element as HTMLElement).getAttribute('modelPath'),
          }
      },},
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['three-d-model', HTMLAttributes];
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: threeDModelInputRegex,
        type: this.type,
      }),
    ];
  },
  addNodeView() {
    const sharedBorderRadius = 15; // Define the missing constant
    
    return ReactNodeViewRenderer((props: NodeViewProps) => {
      // On node instantiation, useState will draw from the node attributes
      // If the attributes are updated, this will re-render, therefore this state is always synced with the node attributes
      const [modelPath, setModelPath] = useState(props.node.attrs.modelPath);

      // Use useEffect to sync the state with props to prevent infinite update loops
      React.useEffect(() => {
        if (props.node.attrs.modelPath !== modelPath) {
          setModelPath(props.node.attrs.modelPath);
        }
      }, [props.node.attrs.modelPath]);

      // If the input is updated, this handler is called
      const handleModelPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setModelPath(newValue);
        props.updateAttributes({ modelPath: newValue });
      };

      return (
        <NodeViewWrapper>
          <input 
            type="text" 
            value={modelPath} 
            onChange={handleModelPathChange} 
            style={{ 
              border: '1.5px solid #34343430', 
              borderRadius: sharedBorderRadius, 
              outline: 'none', 
              backgroundColor: 'transparent', 
              width: `80px`, 
              position: "absolute", 
              zIndex: 1 
            }} 
          />
          <Generic3DModel
            modelPath={`/models-3d/${modelPath}.glb`}
            canvasSize={400}
            modelBaseSize={10}
            positioningStyle={"onStand"}
            color='white'
          />
        </NodeViewWrapper>
      );
    });
  }
});