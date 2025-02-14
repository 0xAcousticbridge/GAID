import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Image, Type } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  position: { x: number; y: number };
  style?: any;
}

export function IdeaCanvas() {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: '',
      position: { x: 0, y: 0 },
    };
    setElements([...elements, newElement]);
  };

  return (
    <div className="idea-canvas">
      <div className="toolbar">
        <button onClick={() => addElement('text')}>
          <Type /> Add Text
        </button>
        <button onClick={() => addElement('image')}>
          <Image /> Add Image
        </button>
        <button onClick={() => addElement('shape')}>
          <PenTool /> Add Shape
        </button>
      </div>
      <div className="canvas">
        {elements.map((element) => (
          <motion.div
            key={element.id}
            className="canvas-element"
            style={element.style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            drag
          >
            {element.type === 'text' && <div>{element.content}</div>}
            {element.type === 'image' && <img src={element.content} alt="" />}
            {element.type === 'shape' && <div className="shape">{element.content}</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}