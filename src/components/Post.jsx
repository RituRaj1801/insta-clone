import React, { useState } from 'react';
import "../style/Post.css";

export default function Post({ profilePic, username, date, mediaType, mediaUrl, likes_count, caption, file_name, profile_picture_url }) {
    const postHeaderStyles = {
        display: 'flex',
        alignItems: 'center', // Vertically align items
        marginBottom: '10px', // Add some spacing below the header
    };

    const profilePicStyles = {
        width: '40px', // Adjust size as needed
        height: '40px',
        borderRadius: '50%', // Make it round
        marginRight: '10px', // Add space between image and text
        objectFit: 'cover' // Prevents image distortion
    };

    const userInfoStyles = {
        display: 'flex',
        flexDirection: 'column', // Stack username and date vertically
    };

    const usernameStyles = {
        fontWeight: 'bold',
        marginBottom: '2px', // Small space between username and date
        fontSize: '16px'
    };

    const dateStyles = {
        fontSize: '12px',
        color: '#888', // Slightly grayed out
    };
    const timeDifference = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffMs = now - postDate; // Difference in milliseconds

        // Calculate time differences
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30); // Approximation
        const years = Math.floor(days / 365); // Approximation

        // Return the appropriate time format
        if (seconds < 60) return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
        if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
        return `${years} year${years > 1 ? 's' : ''} ago`;
    };
    // State to manage the like count locally
    const [likeCount, setLikeCount] = useState(likes_count);

    const update_like_count = async () => {
        try {
            console.log(localStorage.getItem('authToken'));

            const response = await fetch('http://localhost/backend/post/update_like_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: localStorage.getItem('username'),
                    auth_token: localStorage.getItem('authToken'),
                    file_name: file_name,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            // If the request is successful, increment the like count locally
            if (data.status === true && data.status_code === 200) {
                setLikeCount((prevCount) => parseInt(prevCount) + 1); // Increment the like count
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="post">
            {/* Post Header */}
            <div style={postHeaderStyles} className="post-header">
                <img src={profile_picture_url} alt="Profile" style={profilePicStyles} className="profile-pic" />
                <div style={userInfoStyles}>
                    <p style={usernameStyles} className="username">{username}</p>
                    <p style={dateStyles} className="date">{timeDifference(date)}</p>
                </div>
            </div>

            {/* Post Media */}
            <div className="media">
                {mediaType === "mp4" ? (
                    <video src={mediaUrl} className="post-video" autoPlay loop muted></video>
                ) : (
                    <img src={mediaUrl} alt="Post" className="post-img" />
                )}
            </div>

            {/* Post Footer */}
            <div className="post-footer">
                <div className="post-actions">
                    <button className="like-btn" onClick={update_like_count} aria-label="Like this post">
                        ❤️ {likeCount} Likes
                    </button>
                </div>
                <p className="post-caption">{caption}</p>
                {/* <p className="hashtags">{hashtags}</p> */}
            </div>
        </div>
    );
}
