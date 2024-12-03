import React from 'react';
import './Approve.css';

function Approve({ posts, onApprove, onReject }) {
  return (
    <div className="approve-container">
      <button className="Back-button" onClick={() => window.history.back()}>Back</button>
      <h1>Approve Page</h1>
      {posts.length === 0 ? (
        <p>No posts pending approval.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="approve-post">
            <img
              src={post.imageUrl}
              alt={post.caption || "Post Image"}
              className="approve-image"
            />
            <h3>{post.caption}</h3>
            <p>{post.description}</p>
            {post.status === 'pending' && (
              <div className="action-buttons">
                <button
                  onClick={() => onApprove(post.id)}
                  className="approve-button"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(post.id)} // เรียก onReject เมื่อกดปุ่มปฏิเสธ
                  className="reject-button"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Approve;
