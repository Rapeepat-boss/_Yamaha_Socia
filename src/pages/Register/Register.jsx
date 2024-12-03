import React, { useState } from "react";
import "./Register.css";

function Register({ isModalOpen, closeModal, openLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("User already exists");
    } else {
      users.push({
        email,
        password,
        firstName: "",
        lastName: "",
        profileImage: null,
      });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful");
      openLogin();
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="register-container" onClick={(e) => e.stopPropagation()}>
            <div className="register-box">
              <h1 className="register-title">Sign Up</h1>
              <input
                type="email"
                placeholder="Email"
                className="register-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="register-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Repeat password"
                className="register-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="register-button" onClick={handleRegister}>
                Sign up
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

export default Register;
