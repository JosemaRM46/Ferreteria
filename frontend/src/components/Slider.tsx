'use client';
import { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const images = [
  'https://images.pexels.com/photos/1427292/pexels-photo-1427292.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://image.shutterstock.com/image-photo/various-tools-on-wooden-background-260nw-1032848884.jpg',
  'https://image.shutterstock.com/image-photo/various-tools-on-wooden-background-260nw-1032848884.jpg',
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-64 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-between z-10">
        <button onClick={prevSlide} className="bg-gray-800 text-white p-2 rounded-full">
          <ArrowBackIosIcon />
        </button>
        <button onClick={nextSlide} className="bg-gray-800 text-white p-2 rounded-full">
          <ArrowForwardIosIcon />
        </button>
      </div>
      <div className="w-full h-full flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}