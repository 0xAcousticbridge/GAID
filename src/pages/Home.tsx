import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, ArrowRight, Lightbulb, Brain, Users, Star, Coffee, Home as HomeIcon, ShoppingBag, Book, Heart, Camera, Music, Utensils, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    title: "Daily Organization",
    icon: Coffee,
    description: "Streamline your daily routines and tasks with AI assistance",
    examples: ["Morning routine optimization", "Smart task prioritization", "Schedule automation"]
  },
  {
    title: "Home Management",
    icon: HomeIcon,
    description: "Let AI handle your household planning and maintenance",
    examples: ["Meal planning", "Cleaning schedules", "Maintenance tracking"]
  },
  {
    title: "Personal Growth",
    icon: Brain,
    description: "Accelerate your learning and development with AI guidance",
    examples: ["Custom learning paths", "Habit formation", "Goal achievement"]
  },
  {
    title: "Health & Wellness",
    icon: Heart,
    description: "Optimize your wellbeing with personalized AI recommendations",
    examples: ["Workout planning", "Meditation guidance", "Nutrition tracking"]
  },
  {
    title: "Social & Family",
    icon: Users,
    description: "Enhance your relationships with AI-powered organization",
    examples: ["Event planning", "Family activities", "Communication tools"]
  },
  {
    title: "Leisure & Hobbies",
    icon: Camera,
    description: "Make the most of your free time with AI suggestions",
    examples: ["Travel planning", "Creative projects", "Entertainment picks"]
  }
];

const testimonials = [
  {
    quote: "I used to spend 2 hours meal planning each week. The community's AI prompts helped me create a month's worth of personalized recipes in 10 minutes!",
    author: "Maria S.",
    role: "Working Parent",
    metric: "8 hours saved monthly",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    quote: "The family schedule assistant completely transformed how we coordinate our busy lives. No more double bookings or missed appointments!",
    author: "David L.",
    role: "Father of Three",
    metric: "95% less scheduling conflicts",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    quote: "Finding the perfect workout routine was always a challenge until I discovered this community. The AI suggestions are perfectly tailored to my goals.",
    author: "Sarah K.",
    role: "Fitness Enthusiast",
    metric: "30% better results",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  }
];

const howItWorks = [
  {
    title: "Share Your Routine",
    description: "Tell us about your daily schedule, preferences, and goals",
    icon: Users,
    color: "blue"
  },
  {
    title: "Get AI Suggestions",
    description: "Receive personalized recommendations and optimizations",
    icon: Brain,
    color: "purple"
  },
  {
    title: "Improve Together",
    description: "Share results and learn from the community's experiences",
    icon: TrendingUp,
    color: "green"
  }
];

export function Home() {
  return (
    <div className="space-y-24 -mt-8">
      {/* Hero Section */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-12">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&w=2000&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
          <div className="absolute inset-0" style={{ 
            background: `
              radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(234, 88, 12, 0.1) 0%, transparent 50%)
            `
          }} />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Daily Life with <span className="text-yellow-500">Community-Powered AI</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands of people sharing and discovering crowdsourced AI prompts that make everyday tasks effortless. 
                From morning routines to meal planning, unlock AI's potential through human experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login?signup=true"
                  className="inline-flex items-center px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Optimizing Your Life
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Three simple steps to transform your daily routines with AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className={`w-12 h-12 rounded-full bg-${step.color}-500/10 flex items-center justify-center mb-4`}>
                <step.icon className={`h-6 w-6 text-${step.color}-500`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Users", value: "50,000+", icon: Users },
            { label: "Prompts Shared", value: "125,000+", icon: Lightbulb },
            { label: "Hours Automated", value: "1,000,000+", icon: Brain },
            { label: "Satisfaction Rate", value: "98%", icon: Star }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <metric.icon className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-100 mb-2">{metric.value}</div>
              <div className="text-gray-400">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Optimize Every Aspect of Life</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover AI-powered solutions for every part of your daily routine
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all group"
            >
              <category.icon className="h-8 w-8 text-yellow-500 mb-4 group-hover:text-yellow-400 transition-colors" />
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-gray-400 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.examples.map((example, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-yellow-500/50 mr-2" />
                    {example}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how our community is transforming daily routines with AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-100">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{testimonial.quote}</p>
              <div className="flex items-center text-yellow-500">
                <TrendingUp className="h-5 w-5 mr-2" />
                {testimonial.metric}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Daily Life?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our community of innovators and start optimizing your daily routines with AI. 
            Get personalized recommendations and discover new ways to make life easier.
          </p>
          <Link
            to="/login?signup=true"
            className="inline-flex items-center px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Your Data, Your Control</h2>
            <p className="text-gray-400 mb-6">
              We take your privacy seriously. Your data is encrypted, never sold, and always under your control.
              Choose what to share and what to keep private.
            </p>
            <Link
              to="/privacy"
              className="text-yellow-500 hover:text-yellow-400 flex items-center justify-center"
            >
              Learn more about our privacy commitment
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}