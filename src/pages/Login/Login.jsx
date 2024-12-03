import React, { useState } from "react";
import "./Login.css";
import Alert from "react-bootstrap/Alert";

const initialUsers = [
  { email: "admin@gmail.com", password: "admin", role: "admin" },
];

function Login({ isModalOpen, closeModal, openRegister, openForgot, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState({ message: "", variant: "" });

  // Handle Login Function
  const handleLogin = () => {
    let storedUsers = JSON.parse(localStorage.getItem("users"));
    if (!storedUsers) {
      storedUsers = initialUsers;
      localStorage.setItem("users", JSON.stringify(storedUsers));
    }

    const user = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem("current_user", user.email);
      window.dispatchEvent(new Event("storage"));
      setRole(user.role || "user");
      setAlertContent({ message: "Login successful!", variant: "success" });
      setShowAlert(true);
      closeModal();
    } else {
      setAlertContent({ message: "Invalid email or password", variant: "danger" });
      setShowAlert(true);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="login-container" onClick={(e) => e.stopPropagation()}>
            <div className="login-box">
              <h1 className="login-title">Login</h1>
              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginError && <div className="error-message">{loginError}</div>}
              <button className="forgot-password" onClick={openForgot}>
                Forget password?
              </button>
              <button className="login-button" onClick={handleLogin}>
                Login
              </button>
              <button className="signup-button" onClick={openRegister}>
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* React Bootstrap Alert */}
      {showAlert && (
        <Alert
          variant={alertContent.variant}
          onClose={() => setShowAlert(false)}
          dismissible
          className="custom-alert"
        >
          {alertContent.message}
        </Alert>
      )}
    </>
  );
}

export default Login;
