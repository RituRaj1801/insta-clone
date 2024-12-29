import React from "react";
import "../style/NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/dashboard" className="back-home">
        Go Back to Home
      </a>
    </div>
  );
}

export default NotFound;
