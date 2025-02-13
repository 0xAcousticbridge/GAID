import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Plus, 
  Save,
  Share2,
  Users,
  MessageSquare,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { TeamChat } from './TeamChat';
import { TeamBoard } from './TeamBoard';

interface WorkspaceSection {
  id: string;
  title: string;
  content: React.ReactNode;
  icon: React.ElementType;
}

export function IdeaWorkspace() {
  const [activeSection, setActiveSection] = useState('board');
  const [showSidebar, setShowSidebar] = useState(true);

  const sections: WorkspaceSection[] = [
    {
      id: 'board',
      title: 'Task Board',
      content: <TeamBoard />,
      icon: Layout
    },
    {
      id: 'chat',
      title: 'Team Chat',
      content: <TeamChat teamId="123" />,
      icon: MessageSquare
    },
    {
      id: 'docs',
      title: 'Documents',
      content: <div>Documents section</div>,
      icon: FileText
    },
    {
      id: 'media',
      title: 'Media',
      content: <div>Media section</div>,
      icon: ImageIcon
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Layout className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-bold">Project Workspace</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Users className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Save className="h-5 w-5 text-gray-600" />
          </button>
          <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </button>
        </div>
      </div>

      <div className="flex">
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r"
          >
            <nav className="p-4 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg text-sm ${
                    activeSection === section.id
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <section.icon className="h-4 w-4 mr-3" />
                  {section.title}
                </button>
              ))}
            </nav>
          </motion.div>
        )}

        <div className="flex-1 p-6">
          {sections.find((s) => s.id === activeSection)?.content}
        </div>
      </div>
    </div>
  );
}