import React, { useState } from "react";
import "./Forgot.css";

function Forgot({ isModalOpen, closeModal, openLogin }) {
    const [email, setEmail] = useState("");
  
    const handleRequest = () => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((user) => user.email === email);
  
      if (user) {
        alert("Recovery Request sent: Check your email");
      } else {
        alert("User doesn't exist");
      }
      openLogin();
    };
  
    return (
      <>
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="forgot-container" onClick={(e) => e.stopPropagation()}>
              <div className="forgot-box">
                <h1 className="forgot-title">Forgot Password</h1>
                <input
                  type="email"
                  placeholder="Email"
                  className="forgot-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="forgot-button" onClick={handleRequest}>
                  Request reset link
                </button>
                <button className="back-button" onClick={openLogin}>
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  export default Forgot;
