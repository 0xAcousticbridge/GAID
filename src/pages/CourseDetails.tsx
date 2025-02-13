import React from 'react';
import { useParams } from 'react-router-dom';
import { CoursePlayer } from '../components/Learning/CoursePlayer';

export function CourseDetails() {
  const { courseId } = useParams();

  // Mock course data - in a real app, fetch this based on courseId
  const courseData = {
    courseTitle: "AI Fundamentals",
    currentLesson: {
      title: "Introduction to AI",
      videoUrl: "https://example.com/video.mp4",
      description: "In this lesson, we'll cover the basic concepts of artificial intelligence and its applications in modern technology."
    },
    lessons: [
      {
        id: "1",
        title: "Introduction to AI",
        duration: "15 min",
        completed: true
      },
      {
        id: "2",
        title: "Machine Learning Basics",
        duration: "25 min",
        completed: false
      },
      {
        id: "3",
        title: "Neural Networks",
        duration: "30 min",
        completed: false
      }
    ]
  };

  return (
    <div className="space-y-6">
      <CoursePlayer
        courseTitle={courseData.courseTitle}
        currentLesson={courseData.currentLesson}
        lessons={courseData.lessons}
        onLessonChange={(lessonId) => console.log('Change to lesson:', lessonId)}
      />
    </div>
  );
}