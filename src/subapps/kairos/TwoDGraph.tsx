import React, { useState, useCallback, memo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Node,
  Edge,
  addEdge,
  Handle,
  Position,
  ReactFlowInstance,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './react-flow.css';
import { Quanta } from '../../core/Quanta';
import { borderRadius } from '../Theme';
import { motion } from 'framer-motion';

const QuantaNode = ({ data }: { data: { quantaId: string; label: string } }) => {
  const [quantaId, setQuantaId] = useState(data.quantaId || '999999');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantaId(event.target.value);
  };

  return (
    <div
      style={{
        width: '550px',
        maxWidth: '550px',
        maxHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        boxSizing: 'border-box',
        position: 'relative', // Ensure positioning for the drag handle
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      {/* TODO: Need to abstract drag handle and make consistent across components */}

      {/* Drag Handle */}
      <motion.div
        className="custom-drag-handle"
        onMouseLeave={(event) => {
          event.currentTarget.style.cursor = "grab";
        }}
        onMouseDown={(event) => {
          event.currentTarget.style.cursor = "grabbing";
        }}
        onMouseUp={(event) => {
          event.currentTarget.style.cursor = "grab";
        }}
        style={{
          position: 'absolute',
          right: -4,
          top: 10,
          display: 'flex',
          flexDirection: 'column',
          cursor: 'grab',
          fontSize: '24px',
          color: 'grey',
        }}
        contentEditable="false"
        suppressContentEditableWarning={true}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        ⠿
      </motion.div>
      
      <input
        type="text"
        value={quantaId}
        onChange={onChange}
        placeholder="Enter Quanta ID"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          marginBottom: '5px',
          padding: '5px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          maxHeight: '250px', // Adjust as needed to fit within 300px total
        }}
      >
        <Quanta quantaId={quantaId} userId={'user-id'} />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

let id = 0;
const getId = () => `dndnode_${id++}`;

export const TwoDGraph = () => {
  const nodeTypes = React.useMemo(() => ({ quantaNode: QuantaNode }), []);

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'node-1',
      type: 'quantaNode',
      position: { x: 0, y: 0 },
      data: { quantaId: '000005', label: 'Node 1' },
      dragHandle: '.custom-drag-handle', // Specify the drag handle selector
    },
    {
      id: 'node-2',
      type: 'quantaNode',
      position: { x: 0, y: -300 },
      data: { quantaId: '59010df8-9321-4864-abfd-5fdbb4dac9f4', label: 'Node 2' },
      dragHandle: '.custom-drag-handle', // Specify the drag handle selector
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([{ id: 'edge-1', source: 'node-1', target: 'node-2' }]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) {
        return;
      }

      if (reactFlowInstance) {
        const position = reactFlowInstance.project({
          x: event.clientX,
          y: event.clientY,
        });
        const newNode: Node = {
          id: getId(),
          type: 'quantaNode',
          position,
          data: { quantaId: '999999', label: `${type} node` },
          dragHandle: '.custom-drag-handle', // Specify the drag handle selector
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance]
  );

  // Add this new constant for the default viewport
  const defaultViewport = { x: 0, y: 0, zoom: 0.2 };

  return (
    <div
      style={{
        height: '30vh',
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          borderRadius: borderRadius,
          overflow: 'hidden',
        }}
      >
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
          defaultViewport={defaultViewport}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};