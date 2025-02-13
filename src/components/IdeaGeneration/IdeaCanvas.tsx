import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Image, Type, Sticker, Download, Share2 } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  position: { x: number; y: number };
  style?: any;
}

export function IdeaCanvas() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: Image, label: 'Image' },
    { id: 'shape', icon: Sticker, label: 'Shape' },
    { id: 'draw', icon: PenTool, label: 'Draw' },
  ];

  const handleAddElement = (type: 'text' | 'image' | 'shape') => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Double click to edit' : '',
      position: { x: 100, y: 100 },
    };
    setElements([...elements, newElement]);
  };

  const handleExport = () => {
    // Implementation for exporting canvas
  };

  const handleShare = () => {
    // Implementation for sharing canvas
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Idea Canvas</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Export"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-16 space-y-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg ${
                selectedTool === tool.id
                  ? 'bg-yellow-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
              title={tool.label}
            >
              <tool.icon className="h-6 w-6" />
            </button>
          ))}
        </div>

        <div className="flex-1 bg-gray-50 rounded-lg h-[600px] relative">
          {elements.map((element) => (
            <motion.div
              key={element.id}
              drag
              dragMomentum={false}
              initial={element.position}
              className="absolute cursor-move"
            >
              {element.type === 'text' && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="min-w-[100px] min-h-[24px] outline-none"
                >
                  {element.content}
                </div>
              )}
              {element.type === 'image' && (
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
              )}
              {element.type === 'shape' && (
                <div className="w-16 h-16 bg-yellow-200 rounded-lg" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}