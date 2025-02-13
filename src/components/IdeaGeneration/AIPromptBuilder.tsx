import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Wand2, Save, Trash2, Loader2, Send, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
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
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useStore();

  const promptSuggestions = [
    {
      title: "AI Product Idea",
      prompt: "Create an AI product that solves the following problem: "
    },
    {
      title: "Market Analysis",
      prompt: "Analyze the market potential for an AI solution that: "
    },
    {
      title: "Technical Implementation",
      prompt: "Describe the technical architecture for an AI system that: "
    },
    {
      title: "User Experience",
      prompt: "Design the user experience for an AI application that: "
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (userMessage: string) => {
    // Simulate AI response generation
    const responses = [
      "That's an interesting idea! Let's explore it further. Have you considered:",
      "Here's how we could enhance your concept:",
      "Based on current AI trends, here's what we could add:",
      "This idea has potential. Here are some key considerations:"
    ];
    
    const bulletPoints = [
      "• Market validation and target audience analysis",
      "• Technical feasibility and implementation approach",
      "• Potential challenges and solutions",
      "• Unique selling propositions",
      "• Scalability considerations",
      "• Ethical implications and safeguards",
      "• Integration with existing systems",
      "• User experience design principles"
    ];

    // Randomly select a response template and 3-4 bullet points
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    const selectedPoints = bulletPoints
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
      // Simulate AI processing delay
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
          <h2 className="text-xl font-bold text-gray-100">AI Assistant</h2>
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
            <p className="text-lg mb-4">Start a conversation with AI</p>
            <div className="grid grid-cols-2 gap-2">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion.prompt)}
                  className="p-3 text-left text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium block mb-1">{suggestion.title}</span>
                  <span className="text-gray-400">{suggestion.prompt}</span>
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
              placeholder="Type your idea or question..."
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