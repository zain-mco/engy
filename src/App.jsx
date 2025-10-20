import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './utils/supabaseClient';
import Auth from './pages/Auth';
import Home from './pages/Home';
import FolderView from './pages/FolderView';
import SEOHead from './components/SEOHead';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <SEOHead
        title="Eng - Learn English Vocabulary with Audio Pronunciation"
        description="Master English vocabulary with our beautiful pink-themed learning app. Create custom folders, add words with translations, and listen to American accent pronunciation. Perfect for language learners!"
        keywords="English vocabulary, learn English, vocabulary app, pronunciation, American accent, language learning, English words, translation, study English"
        url="https://eng-vocabulary.com"
        image="https://eng-vocabulary.com/og-image.png"
      />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#3d3d3d',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 6px -1px rgba(255, 182, 193, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#ff69b4',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={!session ? <Auth /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/home"
          element={session ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/folder/:folderId"
          element={session ? <FolderView /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
