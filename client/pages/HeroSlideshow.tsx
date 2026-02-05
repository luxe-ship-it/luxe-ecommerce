import { useEffect, useState } from "react";

import hero1 from "../assets/Herophotos/h1.jpeg";
import hero2 from "../assets/Herophotos/h2.jpeg";
import hero3 from "../assets/Herophotos/h3.jpeg";
import hero4 from "../assets/Herophotos/h4.jpeg";
import hero5 from "../assets/Herophotos/h5.jpeg";
import hero6 from "../assets/Herophotos/h6.jpeg";
import hero7 from "../assets/Herophotos/h7.jpeg";
import hero8 from "../assets/Herophotos/h8.jpeg";
import hero9 from "../assets/Herophotos/h9.jpeg";
import hero10 from "../assets/Herophotos/h10.jpeg";
import hero11 from "../assets/Herophotos/h11.jpeg";
import hero12 from "../assets/Herophotos/h12.jpeg";


const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6, hero7, hero8, hero9, hero10, hero11, hero12];


export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[24rem] md:min-h-[32rem] lg:min-h-[36rem] group overflow-hidden rounded-xl">
      {/* Slideshow Images */}
      {heroImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Hero slide ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover
            transition-opacity duration-700 ease-in-out
            transition-transform group-hover:scale-105
            ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent" />

      {/* Discount Badge */}
      <div className="absolute top-6 right-6 bg-red-600/90 backdrop-blur-md text-white px-5 py-2 rounded-full font-semibold text-sm tracking-wide shadow-lg z-10">
        Up to 70% OFF
      </div>
    </div>
  );
}
