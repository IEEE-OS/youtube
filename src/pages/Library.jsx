import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { supabase } from '../utils/supabaseClient';

const Library = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Fetch history from last 7 days, ordered by viewed_at descending
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data, error } = await supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('viewed_at', sevenDaysAgo.toISOString())
          .order('viewed_at', { ascending: false });
          
        if (!error && data) {
          // Filter out duplicates (keep only most recent view per video)
          const uniqueHistory = data.filter((v, i, a) => a.findIndex(t => (t.video_id === v.video_id)) === i);
          setHistory(uniqueHistory);
        }
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-4">Loading history...</div>;

  return (
    <div className="library-page" style={{ padding: '24px' }}>
      <h2>Watch History (Last 7 Days)</h2>
      
      {!user ? (
        <div className="mt-4">
          <p className="text-gray mb-4">You need to sign in to track and view your watch history.</p>
          <Link to="/auth" className="btn btn-primary">Sign In</Link>
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray mt-4">You haven't watched any videos recently.</p>
      ) : (
        <div className="video-grid mt-4">
          {history.map((item) => (
            <div key={item.id} className="video-card animate-fade-in">
              <Link to={`/video/${item.video_id}`}>
                <div className="thumbnail-container">
                  <img src={item.thumbnail_url} alt={item.title} className="thumbnail" />
                </div>
                <div className="video-info flex gap-4 mt-2">
                  <div className="video-details flex flex-col">
                    <h3 className="video-title line-clamp-2">{item.title}</h3>
                    <p className="channel-name text-sm text-gray">{item.channel_title}</p>
                    <p className="text-xs text-gray">Watched {moment(item.viewed_at).fromNow()}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
