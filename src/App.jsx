import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import "./App.css";
import Navbar from "./layouts/Navbar/Navbar";
import Slide from "./layouts/Slide/Slide";
import Gallery from "./layouts/Gallery/Gallery";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Forgot from "./pages/Forgot/Forgot";
import Profile from "./pages/Profile/Profile";
import Activityform from "./pages/ActivityForm/ActivityForm";
import Approve from "./pages/approve/Approve";
import Developed from "./pages/Developed/Developed";

// ข้อมูลเริ่มต้น
const initialPostsData = [];

function App() {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', or 'forgot'
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole ? storedRole : "guest";
  });
  const [isLoading, setIsLoading] = useState(true); // สถานะระหว่างโหลดข้อมูล
  const [posts, setPosts] = useState(initialPostsData); // โพสต์ทั้งหมดในระบบ

  // โหลดโพสต์จาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts"));
    if (savedPosts) {
      setPosts(savedPosts); // โหลดโพสต์จาก localStorage
    }
    setIsLoading(false); // เสร็จสิ้นการโหลด
  }, []);

  // ฟังก์ชันสำหรับอนุมัติโพสต์
  const handleApprove = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, status: "approved" } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    alert("Post approved successfully!");
  };

  // ฟังก์ชันสำหรับปฏิเสธโพสต์
  const handleReject = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    alert("Post rejected successfully!");
  };

  // ฟังก์ชันจัดการ Modal
  const closeModal = () => setActiveModal(null);
  const openLoginModal = () => setActiveModal("login");
  const openRegisterModal = () => setActiveModal("register");
  const openForgotModal = () => setActiveModal("forgot");

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    setRole("guest");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <HashRouter>
        <div className="mb-1">
          <Navbar
            onLoginClick={openLoginModal}
            onRegisterClick={openRegisterModal}
            onLogoutClick={handleLogout}
            role={role}
          />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="mb-4">
                  <Slide role={role} />
                </div>
                <Gallery
                  role={role}
                  posts={posts.filter((post) => post.status === "approved")}
                />
              </>
            }
          />
          {role === "admin" && (
            <>
              <Route path="/admin" element={<div>Admin Panel</div>} />
              <Route path="/activityform" element={<Activityform />} />
              <Route
                path="/approve"
                element={
                  <Approve
                    role={role}
                    posts={posts.filter((post) => post.status === "pending")}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                }
              />
            </>
          )}
          <Route path="/developed" element={<Developed />} />
          {role === "user" && (
            <Route path="/dashboard" element={<div>User Dashboard</div>} />
          )}
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {/* Login Modal */}
        <Login
          isModalOpen={activeModal === "login"}
          closeModal={closeModal}
          openRegister={openRegisterModal}
          openForgot={openForgotModal}
          setRole={(newRole) => {
            setRole(newRole);
            localStorage.setItem("role", newRole);
          }}
        />

        {/* Register Modal */}
        <Register
          isModalOpen={activeModal === "register"}
          closeModal={closeModal}
          openLogin={openLoginModal}
        />

        {/* Forgot Password Modal */}
        <Forgot
          isModalOpen={activeModal === "forgot"}
          closeModal={closeModal}
          openLogin={openLoginModal}
        />
      </HashRouter>
    </div>
  );
}

export default App;
