import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Ideas } from './pages/Ideas';
import { IdeaDetails } from './pages/IdeaDetails';
import { Settings } from './pages/Settings';
import { Insights } from './pages/Insights';
import { Onboarding } from './components/Onboarding';
import { useStore } from './lib/store';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './components/ThemeProvider';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { VoiceCommandProvider } from './components/VoiceCommands/VoiceCommandProvider';
import { ModerationProvider } from './components/ContentModeration/ModerationProvider';

function App() {
  const { user, setUser, onboarding } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <VoiceCommandProvider>
          <ModerationProvider>
            {user && !onboarding.completed && <Onboarding />}
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<Search />} />
                <Route path="ideas" element={<Ideas />} />
                <Route path="ideas/:id" element={<IdeaDetails />} />
                <Route 
                  path="profile" 
                  element={user ? <Profile /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="settings" 
                  element={user ? <Settings /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="insights" 
                  element={user ? <Insights /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="login" 
                  element={!user ? <Login /> : <Navigate to="/profile" />} 
                />
              </Route>
            </Routes>
          </ModerationProvider>
        </VoiceCommandProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;