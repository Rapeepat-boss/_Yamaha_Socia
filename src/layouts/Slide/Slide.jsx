import "./Slide.css";
import React, { useState, useEffect } from "react";

function Slide() {
  const fallbackImages = [
    { url: "https://i.ibb.co/Fhk9HXj/dc7e578068f059eeac30016e5d71e151.webp", details: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A velit dolor nihil maxime sunt deleniti aliquam rem id reprehenderit expedita distinctio, ut modi temporibus suscipit repellendus impedit. Placeat, atque aut." },
    { url: "https://i.ibb.co/SXJh4Kh/566000010970601.webp", details: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A velit dolor nihil maxime sunt deleniti aliquam rem id reprehenderit expedita distinctio, ut modi temporibus suscipit repellendus impedit. Placeat, atque aut." },
    { url: "https://i.ibb.co/6X18DnL/c506c2ecba3440ad9b7303b5e899be13.png", details: "Lorem ipsum dolor sit amet consectetur adipisicing elit. A velit dolor nihil maxime sunt deleniti aliquam rem id reprehenderit expedita distinctio, ut modi temporibus suscipit repellendus impedit. Placeat, atque aut." },
  ];

  const [images, setImages] = useState(fallbackImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImageDetails, setCurrentImageDetails] = useState(null);

  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    if (storedActivities.length > 0) {
      const activityImages = storedActivities.flatMap((activity) => activity.images || []);
      setImages(activityImages.length > 0 ? activityImages : fallbackImages);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const openPopup = (index) => {
    setCurrentImageDetails(images[index]);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentImageDetails(null);
  };

  return (
    <div className="slide-container">
      <div className="slide" onClick={() => openPopup(currentIndex)}>
        <img src={images[currentIndex].url} alt={`Slide ${currentIndex}`} />
      </div>

      <button onClick={prevSlide} className="prev">❮</button>
      <button onClick={nextSlide} className="next">❯</button>

      <div className="indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={currentIndex === index ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <button className="close" onClick={closePopup}>✖</button>
      <img className="popup-image" src={currentImageDetails.url} alt="Popup" />
      <p>{currentImageDetails.details}</p>
    </div>
  </div>
)}
    </div>
  );
}

export default Slide;
