import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onLoginClick, onRegisterClick, role, onLogoutClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลรูปโปรไฟล์เฉพาะผู้ใช้ที่ล็อกอิน
  const fetchProfileImage = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserEmail = localStorage.getItem("current_user"); // ผู้ใช้ที่ล็อกอินอยู่
    const currentUser = storedUsers.find((user) => user.email === currentUserEmail);

    if (currentUser?.profileImage) {
      setProfileImage(currentUser.profileImage);
    } else {
      setProfileImage(null); // ตั้งค่าเป็น null หากไม่มีข้อมูล
    }
  };

  // ฟังก์ชัน handleClick เพื่อเปลี่ยนเส้นทางไปยัง /approve และรีโหลดหน้า
  const handleClick = () => {
    // ทำการเปลี่ยนเส้นทาง
    navigate("/approve");

    // ถ้าคุณต้องการให้รีโหลดหน้าหลังจากการเปลี่ยนเส้นทาง
    window.location.reload();
  };

  // ดึงข้อมูลรูปโปรไฟล์ครั้งแรกและเมื่อ localStorage เปลี่ยนแปลง
  useEffect(() => {
    fetchProfileImage();

    const handleStorageChange = () => {
      fetchProfileImage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="navbar-container">
      <img
        src="https://i.ibb.co/3NM7rzf/logo.png"
        alt="Yamaha Logo"
        className="img-navbar"
        onClick={() => navigate("/")}
      />
      <div className="auth-buttons">
        <div className="nav-links">
        <button
                className="admin-btn"
                onClick={() => navigate("/developed")}
              >
                Developed by

              </button>
          {role === "admin" && (
            <div>
              <button
                className="admin-btn"
                onClick={() => navigate("/activityform")}
              >
                Activityform
              </button>
              <button
                className="admin-btn"
                onClick={handleClick} // เรียก handleClick โดยตรง
              >
                Approve
              </button>
            </div>
          )}
        </div>

        {role === "guest" ? (
          <>
            <button className="login-btn" onClick={onLoginClick}>
              Login
            </button>
            <button className="signup-btn" onClick={onRegisterClick}>
              Register
            </button>
          </>
        ) : (
          <div className="dropdown-container">
            <div className="profile-dropdown" onClick={toggleDropdown}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-placeholder-icon">User</div>
              )}
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  Edit Profile
                </button>
                {/* <button className="dropdown-item">Settings</button> */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.removeItem("current_user"); // ลบสถานะผู้ใช้ปัจจุบัน
                    localStorage.removeItem("role"); // ลบบทบาทผู้ใช้
                    onLogoutClick(); // แจ้ง App.js ว่าผู้ใช้ได้ logout
                    navigate("/"); // กลับไปที่หน้าแรก
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
