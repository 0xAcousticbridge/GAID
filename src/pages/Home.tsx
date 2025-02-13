import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, ArrowRight, Lightbulb } from 'lucide-react';
import { IdeaCard } from '../components/IdeaCard';
import { AIInsights } from '../components/Analytics/AIInsights';
import { motion } from 'framer-motion';

const MOCK_INSIGHTS = [
  {
    id: '1',
    title: 'Rising Interest in Personal Finance AI',
    description: 'Significant increase in AI solutions for personal finance management and budgeting assistance.',
    impact: 92,
    confidence: 88,
    category: 'Trend Analysis',
    recommendations: [
      'Focus on AI-powered budgeting tools',
      'Explore automated savings features',
      'Consider expense tracking automation'
    ]
  },
  {
    id: '2',
    title: 'Health & Wellness Innovation Opportunity',
    description: 'Growing demand for AI-powered wellness tracking and personalized health recommendations.',
    impact: 89,
    confidence: 85,
    category: 'Market Opportunity',
    recommendations: [
      'Develop personalized workout planners',
      'Create AI nutrition advisors',
      'Explore mental wellness applications'
    ]
  }
];

const CATEGORIES = [
  { 
    id: 'finance', 
    name: 'Money & Finance', 
    icon: '💰', 
    description: 'Smart money tips & tools',
    samplePrompt: {
      author: 'innovator42',
      prompt: 'Create an AI-powered personal finance advisor that helps users make better spending decisions and achieve their savings goals.'
    }
  },
  { 
    id: 'health', 
    name: 'Health & Wellness', 
    icon: '🧘‍♀️', 
    description: 'Live your best life',
    samplePrompt: {
      author: 'wellness_guru',
      prompt: 'Design an AI wellness companion that creates personalized meditation and exercise routines based on stress levels and daily activity.'
    }
  },
  { 
    id: 'productivity', 
    name: 'Productivity', 
    icon: '⚡', 
    description: 'Work smarter',
    samplePrompt: {
      author: 'productivity_pro',
      prompt: 'Build an AI task prioritization system that helps users optimize their daily schedule and reduce procrastination.'
    }
  },
  { 
    id: 'cooking', 
    name: 'Food & Cooking', 
    icon: '👩‍🍳', 
    description: 'Kitchen innovations',
    samplePrompt: {
      author: 'chef_ai',
      prompt: 'Create an AI recipe generator that suggests meals based on available ingredients and dietary preferences.'
    }
  },
  { 
    id: 'home', 
    name: 'Home & Living', 
    icon: '🏠', 
    description: 'Smart home solutions',
    samplePrompt: {
      author: 'smart_home_expert',
      prompt: 'Design an AI home management system that automates routine tasks and optimizes energy usage.'
    }
  },
  { 
    id: 'lifestyle', 
    name: 'Lifestyle', 
    icon: '✨', 
    description: 'Daily life upgrades',
    samplePrompt: {
      author: 'lifestyle_hacker',
      prompt: 'Develop an AI lifestyle assistant that helps users build and maintain healthy daily routines.'
    }
  },
  { 
    id: 'education', 
    name: 'Learning & Skills', 
    icon: '📚', 
    description: 'Grow your knowledge',
    samplePrompt: {
      author: 'edu_innovator',
      prompt: 'Create an AI learning companion that adapts to individual learning styles and provides personalized study materials.'
    }
  },
  { 
    id: 'howto', 
    name: 'How-To Guides', 
    icon: '📝', 
    description: 'Step-by-step help',
    samplePrompt: {
      author: 'guide_master',
      prompt: 'Build an AI guide creator that breaks down complex tasks into easy-to-follow steps with visual aids.'
    }
  }
];

const MOCK_IDEAS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: "AI-Powered Personal Learning Assistant",
    description: "An intelligent system that adapts to individual learning styles, creating personalized study plans and interactive content to optimize educational outcomes.",
    category: "Education",
    author: {
      username: "edu_innovator",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    rating: 4.9,
    favorites_count: 428,
    comments_count: 67,
    created_at: '2024-02-15T10:00:00Z',
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: "Sustainable Smart City Platform",
    description: "AI-driven urban management system that optimizes energy usage, traffic flow, and waste management while promoting sustainable living practices.",
    category: "Sustainability",
    author: {
      username: "eco_innovator",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    rating: 4.8,
    favorites_count: 356,
    comments_count: 45,
    created_at: '2024-02-14T15:30:00Z',
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    title: "AI Health Monitoring Ecosystem",
    description: "Comprehensive health tracking system that uses AI to analyze vital signs, sleep patterns, and lifestyle factors to provide personalized wellness recommendations.",
    category: "Health & Wellness",
    author: {
      username: "wellness_guru",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    },
    rating: 4.9,
    favorites_count: 512,
    comments_count: 89,
    created_at: '2024-02-13T09:15:00Z',
  },
];

export function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/50" />
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{ 
            background: `
              radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(234, 88, 12, 0.15) 0%, transparent 50%)
            ` 
          }} />
          <div className="absolute inset-0 grid-pattern opacity-30" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Where <span className="text-yellow-500 glow-text">AI Ideas</span> Come to Life
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join our community of innovators sharing and building the future of AI technology. 
              Discover groundbreaking ideas or share your own vision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/ideas"
                className="inline-flex items-center px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 hover:shadow-glow"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Explore Ideas
              </Link>
              <Link
                to="/ideas/new"
                className="inline-flex items-center px-6 py-3 bg-gray-800/50 backdrop-blur text-gray-100 rounded-lg hover:bg-gray-700/50 border border-gray-700/50 hover:border-yellow-500/50 transition-all transform hover:scale-105"
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                Share Your Idea
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-100">Browse Ideas by Category</h2>
            <p className="text-sm text-gray-400 mt-1">Find AI solutions for everyday life</p>
          </div>
          <Link
            to="/ideas"
            className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/ideas?category=${encodeURIComponent(category.name)}`}
              className="group relative block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <div className="relative p-4 bg-gray-700/50 hover:bg-transparent rounded-lg border border-gray-600 hover:border-yellow-500/50 transition-all">
                <span className="text-2xl mb-2 block" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-400 group-hover:text-gray-200">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Insights */}
          <AIInsights insights={MOCK_INSIGHTS} />

          {/* Latest Ideas */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-yellow-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-100">Latest Ideas</h2>
              </div>
              <Link
                to="/ideas"
                className="text-yellow-500 hover:text-yellow-400 flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            {MOCK_IDEAS.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </section>
        </div>

        <div className="space-y-8">
          <TrendingTopics
            topics={[
              {
                id: '1',
                name: 'AI Education',
                count: 324,
                trend: 15,
                description: 'Innovations in AI-powered learning and education technology'
              },
              {
                id: '2',
                name: 'Sustainable AI',
                count: 256,
                trend: 12,
                description: 'AI solutions for environmental sustainability and conservation'
              },
              {
                id: '3',
                name: 'Healthcare AI',
                count: 198,
                trend: 8,
                description: 'AI applications in medical diagnosis and treatment'
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}