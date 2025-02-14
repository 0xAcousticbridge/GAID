import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Wand2, Save, Trash2, Loader2, Send, ThumbsUp, ThumbsDown, Share2, Coffee, Home, ShoppingBag, Book, Heart, Camera, Music, Utensils } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIPromptBuilderProps {
  onGenerate: (prompt: string) => void;
}

export function AIPromptBuilder({ onGenerate }: AIPromptBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [generating, setGenerating] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useStore();

  const categories = [
    {
      id: 'daily',
      name: 'Daily Life',
      icon: Coffee,
      prompts: [
        "Create an AI assistant that helps with: ",
        "Design a smart home automation for: ",
        "Build a personal AI helper that can: "
      ]
    },
    {
      id: 'home',
      name: 'Home & Family',
      icon: Home,
      prompts: [
        "Develop an AI system for managing family schedules that: ",
        "Create a smart kitchen assistant that: ",
        "Design a family activity planner that: "
      ]
    },
    {
      id: 'shopping',
      name: 'Shopping & Finance',
      icon: ShoppingBag,
      prompts: [
        "Build a personal shopping assistant that: ",
        "Create a budget optimization AI that: ",
        "Design a smart savings tracker that: "
      ]
    },
    {
      id: 'learning',
      name: 'Personal Learning',
      icon: Book,
      prompts: [
        "Design a personalized learning companion that: ",
        "Create a skill development tracker that: ",
        "Build a language learning assistant that: "
      ]
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: Heart,
      prompts: [
        "Create a wellness routine planner that: ",
        "Design a mental health companion that: ",
        "Build a fitness tracking assistant that: "
      ]
    },
    {
      id: 'creative',
      name: 'Creative Hobbies',
      icon: Camera,
      prompts: [
        "Design an AI art companion that: ",
        "Create a music practice assistant that: ",
        "Build a creative writing helper that: "
      ]
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: Music,
      prompts: [
        "Create a personalized entertainment recommender that: ",
        "Design a social event planner that: ",
        "Build a hobby discovery assistant that: "
      ]
    },
    {
      id: 'food',
      name: 'Food & Cooking',
      icon: Utensils,
      prompts: [
        "Design a meal planning assistant that: ",
        "Create a recipe recommendation system that: ",
        "Build a dietary tracking helper that: "
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (userMessage: string) => {
    // Enhanced response generation with practical daily life focus
    const dailyLifeResponses = [
      "That's a practical idea! Here's how it could help in daily life:",
      "Great thinking! This could improve everyday routines by:",
      "Interesting concept! Here's how people could use this daily:",
      "This has real potential for daily use. Consider these aspects:"
    ];
    
    const practicalConsiderations = [
      "• How it fits into daily routines and habits",
      "• User-friendly interface for all age groups",
      "• Privacy and data security for personal use",
      "• Integration with existing daily apps and services",
      "• Cost-effectiveness for regular use",
      "• Time-saving potential for users",
      "• Customization for different household needs",
      "• Offline functionality considerations",
      "• Battery and resource efficiency",
      "• Social sharing and family collaboration features"
    ];

    const baseResponse = dailyLifeResponses[Math.floor(Math.random() * dailyLifeResponses.length)];
    const selectedPoints = practicalConsiderations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 2));

    return `${baseResponse}\n\n${selectedPoints.join('\n')}`;
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await generateResponse(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      onGenerate(response);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSavePrompt = async (content: string) => {
    if (!user) {
      toast.error('Please log in to save prompts');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_prompts')
        .insert([
          {
            user_id: user.id,
            content: content.trim()
          }
        ]);

      if (error) throw error;

      setSavedPrompts([...savedPrompts, content.trim()]);
      toast.success('Prompt saved successfully!');
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-100">Daily AI Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMessages([])}
            className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Wand2 className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <p className="text-lg mb-6">What would you like help with today?</p>
            
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setPrompt(category.prompts[Math.floor(Math.random() * category.prompts.length)]);
                    promptRef.current?.focus();
                  }}
                  className="p-4 text-left bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <category.icon className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400" />
                    <div>
                      <span className="font-medium block">{category.name}</span>
                      <span className="text-sm text-gray-400">
                        {category.prompts.length} prompts
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="mt-2 flex items-center justify-end space-x-2">
                  {message.role === 'assistant' && (
                    <>
                      <button
                        onClick={() => handleSavePrompt(message.content)}
                        className="p-1 text-gray-400 hover:text-gray-300"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-300">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-300">
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-300">
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                  <span className="text-xs opacity-50">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <TextareaAutosize
              ref={promptRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your daily AI idea or ask for suggestions..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-100 placeholder-gray-400 resize-none"
              maxRows={4}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={generating || !prompt.trim()}
            className="flex items-center justify-center p-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}