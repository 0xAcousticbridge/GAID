import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  List,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface CoursePlayerProps {
  courseTitle: string;
  currentLesson: {
    title: string;
    videoUrl: string;
    description: string;
  };
  lessons: Lesson[];
  onLessonChange: (lessonId: string) => void;
}

export function CoursePlayer({
  courseTitle,
  currentLesson,
  lessons,
  onLessonChange
}: CoursePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="aspect-video bg-black relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white" />
            )}
          </button>
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="space-y-1">
              <h3 className="font-medium">{currentLesson.title}</h3>
              <div className="text-sm opacity-75">{courseTitle}</div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-white/10 rounded-full">
                <SkipBack className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full">
                <SkipForward className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full">
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">{currentLesson.title}</h2>
          <p className="text-gray-600">{currentLesson.description}</p>
        </div>

        {showPlaylist && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <List className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="font-medium">Course Content</h3>
                </div>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[400px]">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => onLessonChange(lesson.id)}
                  className="w-full flex items-center p-4 hover:bg-gray-50 border-b"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      {lesson.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2" />
                      )}
                      <span className="font-medium">{lesson.title}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {lesson.duration}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}