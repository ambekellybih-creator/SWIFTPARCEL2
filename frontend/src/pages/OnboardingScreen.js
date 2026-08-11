import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OnboardingScreen.css";
import onboardingIllustration from "../assets/onboarding-illustration.png";

function OnboardingScreen() {
    const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Fast. Safe. Reliable.",
      description: "Delivering smiles to every destination.",
      image: onboardingIllustration,
    },
    {
      title: "Send with Ease.",
      description: "Send your parcels quickly and securely.",
      image: onboardingIllustration,
    },
    {
      title: "Track Every Step.",
      description: "Know exactly where your parcel is.",
      image: onboardingIllustration,
    },
    {
      title: "Receive with Confidence.",
      description: "Safe delivery right to your destination.",
      image: onboardingIllustration,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/login");
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="onboarding-screen">

      {/* Logo */}
      <div className="onboarding-logo">
        <span className="logo-icon">◎</span>
        <span>SwiftParcel</span>
      </div>

      {/* Illustration */}
      <div className="onboarding-image-container">
        <img
          src={slide.image}
          alt="SwiftParcel delivery"
          className="onboarding-image"
        />
      </div>

      {/* Text */}
      <div className="onboarding-text">
        <h1>{slide.title}</h1>

        <p>{slide.description}</p>
      </div>

      {/* Dots */}
      <div className="onboarding-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`onboarding-dot ${
              currentSlide === index ? "active" : ""
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Button */}
      <button
        className="get-started-button"
        onClick={handleNext}
      >
        {currentSlide === slides.length - 1
          ? "Get Started"
          : "Next"}
      </button>

    </div>
  );
}

export default OnboardingScreen;