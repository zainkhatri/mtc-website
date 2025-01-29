// InstagramFeed.js
import React, { useState, useEffect } from 'react';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch('/api/instagram-feed'); // You'll need to create this endpoint
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.slice(0, 3)); // Get only the latest 3 posts
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts: {error}</div>;

  return (
    <div className="instagram-grid">
      {posts.map((post) => (
        <a 
          key={post.id} 
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer" 
          className="instagram-post"
        >
          <img src={post.media_url} alt={post.caption} />
          <div className="instagram-overlay">
            <p>{post.caption?.slice(0, 100)}...</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default InstagramFeed;