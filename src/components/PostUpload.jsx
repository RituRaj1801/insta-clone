// PostUpload.js
import React, { useState, useRef } from 'react';
import '../style/Post.css';
import { Link } from 'react-router-dom';

const PostUpload = ({ backendUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);

    const formData = new FormData();
    const username = localStorage.getItem('username');
    const authToken = localStorage.getItem('authToken');

    if (!username || !authToken) {
      setUploadError("Username or auth token not found in localStorage.");
      setUploading(false);
      return;
    }

    formData.append('username', username);
    formData.append('auth_token', authToken);
    formData.append('caption', caption);
    formData.append('file', selectedFile);

    try {
        // console.log(`${backendUrl}post/upload_post`)
      const response = await fetch(`${backendUrl}post/upload_post`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorData = {message: `HTTP error! status: ${response.status}`}
        try{
            errorData = await response.json();
        }catch(e){

        }
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      console.log('Upload successful:', responseData);

      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption('');
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="post-uploader">
        <h2>Create Post</h2>
        <div className="upload-area">
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
                <div className="upload-placeholder" onClick={handleChooseFile}>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <p>Select from computer</p>
                </div>
            )}
        </div>
        <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={handleCaptionChange}
            className="caption-input"
        />
        <button onClick={handleUpload} className="upload-button" disabled={uploading}>
            {uploading ? "Uploading..." : "Post"}
        </button>
        <button>
        <Link to='/dashboard'>Go Back</Link>
        </button>


        {uploadSuccess === true && <p className="success-message">Upload successful!</p>}
        {uploadError && <p className="error-message">{uploadError}</p>}
    </div>
);
};

export default PostUpload;