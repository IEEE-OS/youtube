import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVideos } from '../utils/api';
import VideoCard from '../components/VideoCard';

const Search = () => {
  const { searchTerm } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearch = async () => {
      setLoading(true);
      const data = await fetchVideos(searchTerm);
      if (data?.items) {
        setVideos(data.items);
      }
      setLoading(false);
    };
    loadSearch();
  }, [searchTerm]);

  return (
    <div className="search-page">
      <h2>Search Results for: <span className="text-gray">{searchTerm}</span></h2>
      {loading ? (
        <div className="video-grid mt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ width: '100%', aspectRatio: '16/9' }}></div>
          ))}
        </div>
      ) : (
        <div className="video-grid mt-4">
          {videos.map((video, idx) => (
            <VideoCard key={idx} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
