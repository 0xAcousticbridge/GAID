import React from 'react';
import { Book, Clock, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  enrolled: number;
  rating: number;
  progress: number;
  thumbnail: string;
}

export function CourseCard({
  title,
  description,
  duration,
  enrolled,
  rating,
  progress,
  thumbnail,
}: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm"
    >
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${thumbnail})` }}
      />
      <div className="p-4">
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{enrolled} enrolled</span>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 mr-1" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          <Book className="h-4 w-4 mr-2" />
          Continue Learning
        </button>
      </div>
    </motion.div>
  );
}