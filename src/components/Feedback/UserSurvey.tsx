import React, { useReducer, useCallback } from 'react';

interface UserSurveyProps {
  onSubmit: (feedback: string) => void;
}

const initialState = {
  feedback: '',
};

function reducer(state: typeof initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload };
    default:
      return state;
  }
}

export function UserSurvey({ onSubmit }: UserSurveyProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_FEEDBACK', payload: e.target.value });
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (state.feedback.trim()) {
        onSubmit(state.feedback);
        dispatch({ type: 'SET_FEEDBACK', payload: '' });
      }
    },
    [state.feedback, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={state.feedback}
        onChange={handleFeedbackChange}
        placeholder="Enter your feedback"
        required
      />
      <button type="submit">Submit Feedback</button>
    </form>
  );
}