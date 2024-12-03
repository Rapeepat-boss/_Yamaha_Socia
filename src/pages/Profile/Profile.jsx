import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // โหลดข้อมูลผู้ใช้ปัจจุบัน
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserEmail = localStorage.getItem("current_user");
    const currentUser = storedUsers.find((user) => user.email === currentUserEmail);

    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setProfileImage(currentUser.profileImage || null);
    }
  }, []);

  // บันทึกข้อมูลผู้ใช้
  const handleSave = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserEmail = localStorage.getItem("current_user");
  
    const updatedUsers = storedUsers.map((user) => {
      if (user.email === currentUserEmail) {
        return { ...user, firstName, lastName, profileImage };
      }
      return user;
    });
  
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Profile saved!");
  
    // แจ้งเตือน Navbar ว่ามีการเปลี่ยนแปลง
    window.dispatchEvent(new Event("storage"));
  };
  

  // อัปเดตรูปภาพ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // เปิดตัวเลือกไฟล์เมื่อคลิกที่รูปภาพ
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // ยกเลิกและกลับหน้าแรก
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <div className="profile-content">
        <div className="profile-image-container" onClick={handleImageClick}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-placeholder">No Image</div>
          )}
          <div className="edit-icon">
            <i className="bi bi-pencil-fill"></i>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className="profile-form">
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </label>
          <div className="profile-buttons">
            <button className="cancell-button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
