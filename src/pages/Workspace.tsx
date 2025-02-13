import React from 'react';
import { IdeaWorkspace } from '../components/Collaboration/IdeaWorkspace';
import { IdeaCanvas } from '../components/IdeaGeneration/IdeaCanvas';

export function Workspace() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <IdeaWorkspace />
        <IdeaCanvas />
      </div>
    </div>
  );
}