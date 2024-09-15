import React from 'react';
import { useState, useCallback, ChangeEvent } from 'react';
import ReactFlow, { Controls, Background, applyEdgeChanges, applyNodeChanges, NodeChange, EdgeChange, Node, Edge, addEdge, Handle, Position, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import './react-flow.css';
import { Quanta } from '../../core/Quanta';
import { Group } from '../logos/Group';
import { borderRadius } from '../Theme';

type NodeType = "richText"

export const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <aside>
        <div className="description">You can drag these nodes to the pane on the right.</div>
        <div className="dndnode input" style={{
              borderColor: "#0041d0"
        }} onDragStart={(event) => onDragStart(event, 'richText')} draggable>
          Rich Text
        </div>
      </aside>
    );
  };

const handleStyle = { left: 10 };

const rfStyle = {
    backgroundColor: '#B8CEFF',
  };

const RichTextNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className="nodrag nopan" style={{cursor: "default"}}>
            <Handle type="target" position={Position.Top} />
            <Group lens={'verticalArray'} quantaId={data.id}>
                <div>{data.label}</div>
            </Group>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />
        </div>
    );
}

const initialNodes: Node[] = [
    {
        id: 'node-1',
        type: 'textUpdater',
        position: { x: 0, y: 0 },
        data: { id: 'node-1', label: 'Build Kairos 0.1' },
    },
    {
        id: 'node-2',
        type: 'textUpdater',
        position: { x: 250, y: 100 },
        data: { id: 'node-2', label: 'Build Chronos 0.1' },
    },
    {
        id: 'node-3',
        type: 'textUpdater',
        position: { x: 500, y: 200 },
        data: { id: 'node-3', label: 'Build NSC2.0' },
    },
    {
        id: 'node-4',
        type: 'textUpdater',
        position: { x: 750, y: 300 },
        data: { id: 'node-4', label: 'Share with Jeffrey Barber' },
    },
];

const initialEdges: Edge[] = [
    { id: 'edge-1', source: 'node-1', target: 'node-2' },
    { id: 'edge-2', source: 'node-2', target: 'node-3' },
    { id: 'edge-3', source: 'node-3', target: 'node-4' },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

export const TwoDGraph = () => {
    const reactFlowWrapper = React.useRef(null);
    const nodeTypes = React.useMemo(() => ({ textUpdater: RichTextNode }), []);

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds: Node<any>[]) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds: Edge<any>[]) => applyEdgeChanges(changes, eds)),
        [],
    );

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }, []);
    
      const onDrop = useCallback(
        (event: React.DragEvent) => {
          event.preventDefault();
    
          const type = event.dataTransfer.getData('application/reactflow');
    
          // check if the dropped element is valid
          if (typeof type === 'undefined' || !type) {
            return;
          }
    
          // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
          // and you don't need to subtract the reactFlowBounds.left/top anymore
          // details: https://reactflow.dev/whats-new/2023-11-10
              if (reactFlowInstance) {
                  const position = reactFlowInstance.screenToFlowPosition({
                      x: event.clientX,
                      y: event.clientY,
                  });
                  const newNode = {
                      id: getId(),
                      type,
                      position,
                      data: { label: `${type} node` },
                  };

                  setNodes((nds) => nds.concat(newNode));

              }
        },
        [reactFlowInstance],
      );

    return (
        <div style={{ 
            height: '100vh', 
            width: '100%', 
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{ 
                height: '100%', 
                width: '100%', 
                borderRadius: borderRadius,
                overflow: 'hidden'
            }}>
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    fitView
                    style={rfStyle}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}