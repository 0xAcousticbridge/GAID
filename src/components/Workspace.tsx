import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '../lib/store';
import { Maximize2, Minimize2, Layout, Plus } from 'lucide-react';

export function Workspace() {
  const { workspace, updateWorkspace } = useStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = workspace.widgets.findIndex((w: any) => w.id === active.id);
      const newIndex = workspace.widgets.findIndex((w: any) => w.id === over.id);

      updateWorkspace({
        widgets: arrayMove(workspace.widgets, oldIndex, newIndex),
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleSidebar = () => {
    updateWorkspace({
      preferences: {
        ...workspace.preferences,
        showSidebar: !workspace.preferences.showSidebar,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Layout className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-bold">Workspace</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5 text-gray-600" />
            ) : (
              <Maximize2 className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </button>
        </div>
      </div>

      <div className="p-6">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={workspace.widgets}
            strategy={verticalListSortingStrategy}
          >
            {/* Workspace content */}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}