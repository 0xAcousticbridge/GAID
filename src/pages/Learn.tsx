import React from 'react';
import { Book, Star, Users, Clock } from 'lucide-react';
import { CourseCard } from '../components/Learning/CourseCard';

export function Learn() {
  const courses = [
    {
      title: "AI Fundamentals",
      description: "Learn the basics of artificial intelligence and machine learning",
      duration: "6 hours",
      enrolled: 1250,
      rating: 4.8,
      progress: 0,
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
    },
    {
      title: "Building AI Applications",
      description: "Hands-on course for developing AI-powered applications",
      duration: "8 hours",
      enrolled: 850,
      rating: 4.7,
      progress: 30,
      thumbnail: "https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Learning Center</h1>
        <button className="text-yellow-500 hover:text-yellow-600 font-medium">
          Browse All Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
}