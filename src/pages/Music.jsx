import React, { useEffect, useState } from 'react';
import { fetchMusic } from '../utils/api';
import VideoCard from '../components/VideoCard';
import './Music.css';

const LANGUAGES = ['Global', 'English', 'Spanish', 'Korean', 'Hindi', 'Japanese'];

const Music = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('music_lang') || null);

  useEffect(() => {
    if (!language) return;
    
    const loadVideos = async () => {
      setLoading(true);
      const data = await fetchMusic(language);
      if (data?.items) {
        setVideos(data.items);
      }
      setLoading(false);
    };
    loadVideos();
  }, [language]);

  const selectLanguage = (lang) => {
    localStorage.setItem('music_lang', lang);
    setLanguage(lang);
  };

  if (!language) {
    return (
      <div className="language-selector-page flex-col items-center justify-center text-center">
        <h1 className="hero-title animate-fade-in mb-4">Choose Your Vibe</h1>
        <p className="text-gray mb-4">Select your preferred language for music recommendations.</p>
        <div className="lang-grid mt-4">
          {LANGUAGES.map((lang, idx) => (
            <button 
              key={lang} 
              className="lang-bubble animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => selectLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page" style={{ padding: '24px' }}>
      <div className="flex justify-between items-center mb-4">
        <h2>Trending Music: <span className="neon-text">{language}</span></h2>
        <button className="btn-glass text-xs" onClick={() => selectLanguage(null)}>Change Language</button>
      </div>

      {loading ? (
        <div className="bento-grid mt-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton bento-item" style={{ minHeight: '200px' }}></div>
          ))}
        </div>
      ) : (
        <div className="bento-grid mt-4">
          {videos.map((video, idx) => (
            <div className="bento-item" key={idx}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Music;
