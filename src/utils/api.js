import axios from 'axios';

const API_KEY = 'AIzaSyAM8zghSU60PtCtTFrQPo3YPllHNeaFHH0';
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

export const fetchFromAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}&key=${API_KEY}`);
    return data;
  } catch (error) {
    console.error("Error fetching data from YouTube API:", error);
    return null;
  }
};

export const fetchVideos = async (query = 'new videos') => {
  const url = `search?part=snippet&q=${query}&maxResults=50&type=video`;
  return await fetchFromAPI(url);
};

export const fetchVideoDetails = async (videoId) => {
  const url = `videos?part=snippet,statistics&id=${videoId}`;
  return await fetchFromAPI(url);
};

export const fetchRelatedVideos = async (videoId) => {
  // The 'relatedToVideoId' parameter is deprecated by YouTube API v3 and returns a 400 error.
  // Instead, we will fetch generic popular/recommended videos for the sidebar to prevent errors.
  const url = `search?part=snippet&q=recommended&type=video&maxResults=20`;
  return await fetchFromAPI(url);
};

export const fetchMusic = async (language = 'Global') => {
  // Fetch popular music videos based on language preference
  const query = language === 'Global' ? 'latest music videos Vevo' : `latest ${language} music videos Vevo`;
  const url = `search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=50`;
  return await fetchFromAPI(url);
};

export const fetchShorts = async () => {
  // YouTube API v3 doesn't have a direct "shorts" endpoint.
  // We search for #shorts
  const url = `search?part=snippet&q=%23shorts&maxResults=30&type=video`;
  return await fetchFromAPI(url);
};
