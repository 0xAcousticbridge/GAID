// import React from 'react';
import { useReducer, useCallback } from 'react';
import { Star, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'rating' | 'text' | 'boolean';
}

type SurveyState = {
  currentQuestion: number;
  answers: Record<string, any>;
};

type SurveyAction =
  | { type: 'NEXT_QUESTION' }
  | { type: 'SET_ANSWER'; questionId: string; answer: any };

export function UserSurvey() {
  const initialState = { currentQuestion: 0, answers: {} };

  function reducer(state: SurveyState, action: SurveyAction): SurveyState {
    switch (action.type) {
      case 'NEXT_QUESTION':
        return { ...state, currentQuestion: state.currentQuestion + 1 };
      case 'SET_ANSWER':
        return { ...state, answers: { ...state.answers, [action.questionId]: action.answer } };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const questions: SurveyQuestion[] = [
    {
      id: 'ease_of_use',
      question: 'How easy is it to use our platform?',
      type: 'rating',
    },
    {
      id: 'feature_satisfaction',
      question: 'Are you satisfied with our features?',
      type: 'boolean',
    },
    {
      id: 'improvement',
      question: 'How can we improve your experience?',
      type: 'text',
    },
  ];

  const handleAnswer = useCallback((questionId: string, answer: any) => {
    dispatch({ type: 'SET_ANSWER', questionId, answer });
    if (state.currentQuestion < questions.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }, [state.currentQuestion]);

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswer(question.id, rating)}
                className={`p-2 rounded-lg transition-colors ${
                  state.answers[question.id] === rating
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Star
                  className={`h-6 w-6 ${
                    state.answers[question.id] >= rating
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleAnswer(question.id, true)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                state.answers[question.id] === true
                  ? 'bg-green-100 text-green-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Yes
            </button>
            <button
              onClick={() => handleAnswer(question.id, false)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                state.answers[question.id] === false
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              No
            </button>
          </div>
        );

      case 'text':
        return (
          <div className="w-full">
            <TextareaAutosize
              value={state.answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              minRows={3}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">Help Us Improve</h2>
        <p className="text-gray-600">
          Your feedback helps us create a better experience for everyone.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">
            {questions[state.currentQuestion].question}
          </h3>
          {renderQuestion(questions[state.currentQuestion])}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === state.currentQuestion ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {state.currentQuestion === questions.length - 1 && (
            <button
              onClick={() => {
                // Submit survey answers
              }}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}