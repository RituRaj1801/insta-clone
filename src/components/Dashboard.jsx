import React, { useEffect, useState } from "react";
import "../style/Dashboard.css";
import Post from "./Post";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        console.log(authToken);

        const response = await fetch(`${process.env.REACT_APP_API_URL}post/get_post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            auth_token: localStorage.getItem("authToken"),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setPosts(data.data || []); // Assuming `data.data` contains posts
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: (post.likes || 0) + 1 }
          : post
      )
    );
  };

  return (
    <>
      <div className="container">

        {/* Sidebar */}
        <div className="sidebar">
          <h1 className="logo">Instagram</h1>
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Search</a></li>
              <li><a href="#">Explore</a></li>
              <li><a href="#">Reels</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Notifications</a></li>
              <li><a href="/upload_post">Upload</a></li>
              <li><Link to="/UserProfile">Profile</Link></li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {posts.length > 0 ? (
            posts.map((post) => {
              console.log(post); // Log the post here
              return (
                <Post
                  key={post.id}
                  profilePic={post.profilePic}
                  username={post.username}
                  date={post.created_at}
                  mediaType={post.media_type}
                  mediaUrl={post.media_url}
                  likes_count={post.likes_count}
                  caption={post.caption}
                  file_name={post.file_name}
                  profile_picture_url={post.profile_picture_url}
                />
              );
            })
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </>
  );
}
