'use client';
import { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const images = [
  'https://ferrebaratilloimage.s3.us-east-2.amazonaws.com/banners1.jpg',
  'https://ferrebaratilloimage.s3.us-east-2.amazonaws.com/Portada+NATURAL+DECOR.png',
  'https://ferrebaratilloimage.s3.us-east-2.amazonaws.com/Portada+ecomers+Universal.png',
  'https://www.portalmayorista.com/images/Slide-black-week-mayorista-Noviembre2024-PortalMayorista4.jpg?1733024114481',
  'https://www.portalmayorista.com/images/Slide-moldes-silicona-Navidad-2024-PortalMayorista.jpg?1733024115252',
  


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
    <div className="relative w-full h-70 overflow-hidden">
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