import React, { useState, useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import "./Gallery.css";


const initialPostsData = [
  {
    id: 1,
    imageUrl:
      "https://storagetym.blob.core.windows.net/www2021/images/product-2021/commuter/model-year-2024/yzf-r3-2024/yamaha-yzf-r3-2024_555x460px.png?sfvrsn=70e8dd65_2",
    caption: "Caption 2",
    description: "This is a detailed description.",
    status: "pending",
    likes: 0,
    comments: [],
    username: "Yamaha",
  },
  {
    id: 2,
    imageUrl:
      "https://storagetym.blob.core.windows.net/www2021/images/product-2021/commuter/model-year-2024/yzf-r3-2024/yamaha-yzf-r3-2024_555x460px.png?sfvrsn=70e8dd65_2",
    caption: "Caption 3",
    description: "Another post description.",
    status: "approved",
    likes: 0,
    comments: [],
    username: "Manky D rufi",
  },
];

function Post(role) {
  const currentUserEmail = localStorage.getItem("current_user");
  const storedUsers = JSON.parse(localStorage.getItem("users")) || []; 
  const currentUser = storedUsers.find(user => user.email === currentUserEmail);
  const isAdmin = currentUserEmail === "admin"; 

  const [posts, setPosts] = useState(() => {
    // ดึงข้อมูลจาก Local Storage เมื่อโหลดแอป
    const savedPosts = localStorage.getItem("posts");
    return savedPosts ? JSON.parse(savedPosts) : initialPostsData;
  });

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likedComments, setLikedComments] = useState(new Set());
  const [currentPost, setCurrentPost] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddPostPopupOpen, setIsAddPostPopupOpen] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false); 
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const postsPerPage = 9; 
  const [filterText, setFilterText] = useState("");
  // deletePost
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [postToDelete, setPostToDelete] = useState(null); 

  // New Post state
  const [newImageFile, setNewImageFile] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Comment/Reply state
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);

  // Ref for comment section to enable scrolling to the newest comment
  const commentSectionRef = useRef(null);

  // ฟังก์ชันบันทึกโพสต์ลง Local Storage
  const savePostsToLocalStorage = (updatedPosts) => {
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  


  // filter
  const approvedPosts = posts.filter(post => post.status === "approved");

const filteredPosts = approvedPosts.filter((post) => {
  const matchesFilterText =
    post.caption.toLowerCase().includes(filterText.toLowerCase()) ||
    post.description.toLowerCase().includes(filterText.toLowerCase());

  const matchesHashtag =
    !selectedHashtag ||
    post.caption.includes(selectedHashtag) ||
    post.description.includes(selectedHashtag);

  return matchesFilterText && matchesHashtag;
});
   const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewImageFile(file);
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setImageData((prevData) => ({
        ...prevData,
        imageUrl: blobUrl,
      }));
    }
  };
  



  // คำนวณโพสต์ที่จะปรากฏบนหน้าปัจจุบัน
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);



  // Opens the Add Post Popup
  const openAddPostPopup = () => setIsAddPostPopupOpen(true);

  // Closes the Add Post Popup and clears the new post fields
  const closeAddPostPopup = () => {
    setIsAddPostPopupOpen(false);
    setNewImageFile(null);
    setNewCaption("");
    setNewDescription("");
  };

  const handleAddPost = () => {
    const currentUserEmail = localStorage.getItem("current_user");
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(user => user.email === currentUserEmail);
  
    if (newImageFile && newCaption) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result; // เป็น Base64 URL
        const newPost = {
          id: posts.length + 1,
          imageUrl,
          caption: newCaption,
          description: newDescription,
          username: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Anonymous",
          email: currentUser?.email,
          likes: 0,
          comments: [],
          status: "pending",
        };
  
        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);
  
        savePostsToLocalStorage(updatedPosts);
        const newTotalPages = Math.ceil(updatedPosts.length / postsPerPage);
        setCurrentPage(newTotalPages);
  
        closeAddPostPopup();
      };
      reader.readAsDataURL(newImageFile); // อ่านไฟล์เป็น Base64
    }
  };

  // บันทึกการเปลี่ยนแปลงโพสต์ลง Local Storage เมื่อใดก็ตามที่ state `posts` เปลี่ยน
  useEffect(() => {
    savePostsToLocalStorage(posts);
  }, [posts]);

  // Hashtags
  useEffect(() => {
    extractHashtags();
  }, [posts]);

  const extractHashtags = () => {
    const allHashtags = [];
    posts.forEach((post) => {
      const captionTags = post.caption.match(/#[a-zA-Z0-9_]+/g) || [];
      const descriptionTags = post.description.match(/#[a-zA-Z0-9_]+/g) || [];
      allHashtags.push(...captionTags, ...descriptionTags);
    });
    setHashtags([...new Set(allHashtags)]);
  };

  // Opens a post in the popup
  const handlePostClick = (post) => {
    setCurrentPost(post);
    setIsPopupOpen(true);
  };

  // Toggles like/unlike functionality for posts
  const handleLikePost = (postId) => {
    const postIndex = posts.findIndex((post) => post.id === postId);
    const updatedPost = { ...posts[postIndex] };

    if (likedPosts.has(postId)) {
      updatedPost.likes -= 1;
      setLikedPosts((prev) => new Set([...prev].filter((id) => id !== postId)));
    } else {
      if (role.role !== "guest") {
        updatedPost.likes += 1;
        setLikedPosts((prev) => new Set(prev).add(postId));
      }

    }

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    setPosts(updatedPosts);

    if (currentPost && currentPost.id === postId) {
      setCurrentPost(updatedPost);
    }
  };

  // Adds a comment or a reply to a comment
  const handleComment = (postId, parentId = null) => {
    const postIndex = posts.findIndex((post) => post.id === postId);
    const updatedPost = { ...posts[postIndex] };

    // Retrieve the current user's email and user data from localStorage
    const currentUserEmail = localStorage.getItem("current_user");
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(user => user.email === currentUserEmail);

    const newComment = {
      id: Date.now(),
      text: parentId ? replyInput : commentInput,
      likes: 0, // For liking comments/replies
      replies: [],
      email: currentUser?.email,
      username: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Anonymous",
      profileImage: currentUser?.profileImage || "default-profile.png", 
    };
    if (role.role !== "guest") {
      if (parentId) {
        const commentIndex = updatedPost.comments.findIndex(
          (comment) => comment.id === parentId
        );
        updatedPost.comments[commentIndex].replies.push(newComment);
        setReplyInput("");
        setReplyToCommentId(null);
      } else {
        updatedPost.comments.push(newComment);
        setCommentInput("");
      }
    }
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    setPosts(updatedPosts);


    if (currentPost && currentPost.id === postId) {
      setCurrentPost(updatedPost);
    }

    // Scroll to the bottom of the comment section after adding a comment or reply
    setTimeout(() => {
      if (commentSectionRef.current) {
        commentSectionRef.current.scrollTop =
          commentSectionRef.current.scrollHeight;
      }
    }, 0);
  };

  // Toggles like/unlike functionality for comments and replies
  const handleLikeComment = (
    postId,
    commentId,
    isReply = false,
    replyId = null
  ) => {
    const uniqueId = `${postId}-${commentId}-${isReply ? `reply-${replyId}` : "comment"
      }`;
    const postIndex = posts.findIndex((post) => post.id === postId);
    const updatedPost = { ...posts[postIndex] };

    const updateLike = (item) => {
      if (likedComments.has(uniqueId)) {
        item.likes -= 1;
        setLikedComments((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(uniqueId);
          return updatedSet;
        });
      } else {
        if (role.role !== "guest") {
          item.likes = (item.likes || 0) + 1;
          setLikedComments((prev) => new Set(prev).add(uniqueId));
        }



      }
      return item;
    };

    updatedPost.comments = updatedPost.comments.map((comment) => {
      if (comment.id === commentId) {
        if (isReply && replyId) {
          comment.replies = comment.replies.map((reply) =>
            reply.id === replyId ? updateLike(reply) : reply
          );
        } else {
          updateLike(comment);
        }
      }
      return comment;
    });

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    setPosts(updatedPosts);

    if (currentPost && currentPost.id === postId) {
      setCurrentPost(updatedPost);
    }
  };

  // Deletes a specific comment or reply
  const handleDeleteComment = (
    postId,
    commentId,
    isReply = false,
    replyId = null
  ) => {
    const postIndex = posts.findIndex((post) => post.id === postId);
    const updatedPost = { ...posts[postIndex] };

    if (isReply && replyId) {
      updatedPost.comments = updatedPost.comments.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          }
          : comment
      );
    } else {
      updatedPost.comments = updatedPost.comments.filter(
        (comment) => comment.id !== commentId
      );
    }

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    setPosts(updatedPosts);

    if (currentPost && currentPost.id === postId) {
      setCurrentPost(updatedPost);
    }
  };

  // Initiates reply to a specific comment
  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId);
    setReplyInput("");
  };

  // Cancels the reply input
  const handleCancelReply = () => {
    setReplyToCommentId(null);
    setReplyInput("");
  };

  // Deletes a post with confirmation
  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId)); 
    setCurrentPost(null); 
  };

  // Toggles the share popup visibility
  const handleSharePost = () => {
    setIsSharePopupOpen((prev) => !prev);
  };

  // Closes the popup
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setCurrentPost(null);
  };

  // ฟังก์ชันเปลี่ยนหน้า
  const handleNextPage = () => {
    if (indexOfLastPost < filteredPosts.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const confirmDeletePost = (postId) => {
    if (!posts.find(post => post.id === postId)) {
      console.warn("Post ID not found.");
      return;
    }
    setPostToDelete(postId); 
    setShowDeleteModal(true); 
  };

  return (
    <div className="post-container">
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You don't necessarily want to delete this post? This is irreversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeletePost(postToDelete); 
              setShowDeleteModal(false); 
            }}
          >
            Done
          </Button>

        </Modal.Footer>
      </Modal>
      {/* New Post Button */}
      <div className="add-post">

        {role.role !== "guest" && (
          <button onClick={openAddPostPopup} className="new-post-button">
            <span className="bi bi-plus-square-fill"></span> New Post
          </button>
        )}



        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Hashtag Filter */}
        <div className="hashtag-filter">
          <label htmlFor="hashtag-select" className="hashtag-filter-label">
            Filter by Hashtag:
          </label>
          <select
            id="hashtag-select"
            className="hashtag-select"
            value={selectedHashtag || ""}
            onChange={(e) => setSelectedHashtag(e.target.value || null)}
          >
            <option value="">-- All Posts --</option>
            {hashtags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Add Post Popup */}
      {isAddPostPopupOpen && (
        <div className="add-post-popup" onClick={closeAddPostPopup}>
          <div
            className="add-post-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="popup-title">Add New Post</h3>
            <input
        className="image-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        placeholder="Upload an image"
      />
            <input
              className="caption-input"
              type="text"
              placeholder="Enter Caption"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />
            <textarea
              className="description-input"
              placeholder="Enter Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            ></textarea>
            <button className="add-post-button" onClick={handleAddPost}>
              Add Post
            </button>
            <button className="cancel-button" onClick={closeAddPostPopup}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Post Gallery */}
      <div className="gallery">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="post"
            onClick={() => handlePostClick(post)}
          >
            <img src={post.imageUrl} alt={`Post ${post.id}`} />
            <p className="caption">{post.caption}</p>
            <p className="description">{post.description}</p>
            <small className="text-muted">Posted by: {post.username}</small>
          </div>
        ))}
      </div>

      {/* Post Detail Popup */}
      {isPopupOpen && currentPost && (
        <div className="post-detail-popup" onClick={handlePopupClose}>
          <div
            className="post-detail-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-popup-button" onClick={handlePopupClose}>
              &times;
            </button>
            <div className="popup-content-left">
              <img src={currentPost.imageUrl} alt={`Post ${currentPost.id}`} />
            </div>
            <div className="popup-content-right">
              <p className="caption">{currentPost.caption}</p>
              <div className="description-full">{currentPost.description}</div>
              <small className="text-muted">Posted by: {currentPost.username}</small>
              <div className="like-comment-container">
                <button
                  onClick={() => handleLikePost(currentPost.id)}
                  className="like-button"
                >
                  <div className="like-content">
                    <span
                      className={
                        likedPosts.has(currentPost.id)
                          ? "bi bi-heart-fill"
                          : "bi bi-heart"
                      }
                    ></span>
                    <span className="like-count">{currentPost.likes}</span>
                  </div>
                </button>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Add a comment"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && commentInput.trim()) {
                      handleComment(currentPost.id);
                    }
                  }}
                />
                <button className="share-button" onClick={handleSharePost}>
                  <span className="bi bi-share"></span>
                </button>
                <button
                  className="comment-button"
                  onClick={() => confirmDeletePost(currentPost.id)}
                >

                  {(currentPost.email === currentUser?.email || isAdmin) && (
                    <span className="bi bi-trash"></span>
                  )}
                </button>

              </div>
              <div ref={commentSectionRef} className="comment-section">
                {currentPost.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="d-flex align-items-center">
                      <img
                        src={comment.profileImage || "default-profile.png"}
                        alt="Profile"
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <span className="fw-bold">{comment.username}</span>
                    </div>
                    <p className="mt-2">{comment.text}</p>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() => handleLikeComment(currentPost.id, comment.id)}
                        className="btn btn-link p-0"
                      >
                        <i
                          className={
                            likedComments.has(`${currentPost.id}-${comment.id}-comment`)
                              ? "bi bi-heart-fill text-danger"
                              : "bi bi-heart"
                          }
                        ></i>
                      </button>
                      <span>{comment.likes || 0}</span>

                      <button
                        onClick={() => handleDeleteComment(currentPost.id, comment.id)}
                        className="btn btn-link text-danger p-0"
                      >

                        {(comment.email === currentUser?.email || isAdmin) && (
                          <i className="bi bi-trash"></i>
                        )}

                      </button>

                      {role.role !== "guest" && (
                        <button
                          className="btn btn-link p-0"
                          onClick={() => handleReplyClick(comment.id)}
                        >
                          Reply
                        </button>
                      )}


                    </div>

                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="reply ps-4 border-start ms-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={reply.profileImage || "default-profile.png"}
                            alt="Profile"
                            className="rounded-circle me-2"
                            style={{ width: "30px", height: "30px" }}
                          />
                          <span className="fw-bold">{reply.username}</span>
                        </div>
                        <p className="mt-2">{reply.text}</p>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            onClick={() =>
                              handleLikeComment(currentPost.id, comment.id, true, reply.id)
                            }
                            className="btn btn-link p-0"
                          >
                            <i
                              className={
                                likedComments.has(`${currentPost.id}-${comment.id}-reply-${reply.id}`)
                                  ? "bi bi-heart-fill text-danger"
                                  : "bi bi-heart"
                              }
                            ></i>
                          </button>
                          <span>{reply.likes || 0}</span>

                          <button
                            onClick={() =>
                              handleDeleteComment(currentPost.id, comment.id, true, reply.id)
                            }
                            className="btn btn-link text-danger p-0"
                          >
                            {(comment.email === currentUser?.email || isAdmin) && (
                              <i className="bi bi-trash"></i>
                            )}

                          </button>
                        </div>
                      </div>
                    ))}
                    {replyToCommentId === comment.id && (
                      <div className="reply-input">
                        <input
                          type="text"
                          placeholder="Write a reply"
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && replyInput.trim()) {
                              handleComment(currentPost.id, comment.id, true, replyInput);
                            }
                          }}
                        />
                        <div>
                          <button className="reply-reply"
                            onClick={() =>
                              handleComment(currentPost.id, comment.id)
                            }
                          >
                            Reply
                          </button>
                          <button className="reply-cancel" onClick={handleCancelReply}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (commentInput.trim()) handleComment(currentPost.id);
                }}
                className="delete-button"
                title="Comment Post"
              >

                <span className="bi bi-send"></span>


              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        
        <span>
    Page {currentPage} of {Math.ceil(filteredPosts.length / postsPerPage)}
  </span>

        <button
          onClick={handleNextPage}
          disabled={indexOfLastPost >= filteredPosts.length}
        >
          Next
        </button>
      </div>

      {/* Share Popup */}
      {isSharePopupOpen && (
        <div className="share-popup" onClick={() => setIsSharePopupOpen(false)}>
          <div
            className="share-popup-content"
            onClick={(e) => e.stopPropagation()} // หยุด event propagation
          >
            <h3>Share this Post</h3>
            <button className="share-option">
              <span className="bi bi-facebook"></span> Facebook
            </button>
            <button className="share-option">
              <span className="bi bi-instagram"></span> Instagram
            </button>
            <button className="share-option">
              <span className="bi bi-chat-dots"></span> LINE
            </button>
            <button className="share-option">
              <span className="bi bi-twitter-x"></span> X
            </button>
            <button className="share-option">
              <span className="bi bi-envelope"></span> Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
