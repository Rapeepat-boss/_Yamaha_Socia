import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import './ActivityForm.css';

function ActivityForm() {
  const [images, setImages] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false); // New state for alert visibility
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({ url: URL.createObjectURL(file), details: '' }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDetailsChange = (index, details) => {
    const updatedImages = [...images];
    updatedImages[index].details = details;
    setImages(updatedImages);
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const existingActivities = JSON.parse(localStorage.getItem('activities')) || [];
    const newActivity = { images };
    const updatedActivities = [...existingActivities, newActivity];

    localStorage.setItem('activities', JSON.stringify(updatedActivities));
    setAlertVisible(true);
    setImages([]);
  };

  return (
    <div className="activity-form-container">
      <div className="container">
        <h2 className="activity-form-header">Add activity</h2>
        <form id="postForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="postImages">Upload File:</label>
            <input type="file" id="postImages" accept="image/*" multiple onChange={handleFileChange} />
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-preview-wrapper">
                  <img src={image.url} alt={`Preview ${index}`} className="image-preview" />
                  <input
                    type="text"
                    placeholder="Activity Description"
                    value={image.details}
                    onChange={(e) => handleDetailsChange(index, e.target.value)}
                    className="image-details-input"
                  />
                  <button className="delete-btn" onClick={() => handleDeleteImage(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <button type="button" className="buntton-cancel" onClick={() => navigate("/")}>Cancel</button>
            <button type="submit" className="buntton-submitt">Submit</button>
          </div>
        </form>
      {/* Dismissible Alert */}
        {alertVisible && (
          <Alert variant="success" onClose={() => setAlertVisible(false)} dismissible>
            <Alert.Heading>Activity Saved!</Alert.Heading>
            <p>Your activity has been successfully saved.</p>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default ActivityForm;