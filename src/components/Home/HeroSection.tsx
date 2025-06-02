import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import BannerHome from "@/assets/images/banner-home.webp";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        <div className="w-[55vw] absolute z-10">
          <svg
            viewBox="0 0 1165 752"
            fill="none"
            preserveAspectRatio="none"
            className="h-[calc(100%-24px)] w-full"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1164.16 -6.60776e-05L7.04628e-05 -0.000167852L4.73423e-06 751.847C98.6731 729.969 233.883 724.716 422.673 744.159C693.712 772.072 756.53 664.162 907.288 405.187C970.323 296.905 1048.73 162.214 1164.16 -6.60776e-05Z"
              fill="#086868"
            />
          </svg>
        </div>
        <Image
          src={BannerHome}
          alt="Banner Home"
          className="w-full h-full object-cover"
          fill
          style={{ objectPosition: "right" }}
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute z-20 text-white w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 md:py-10">
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          <p className="lg:text-4xl md:text-2xl text-xl font-bold leading-tight">
            <span className="block">Get instant</span>
            <span className="block">chords for any</span>
            <span className="block">song</span>
          </p>
          <p className="lg:text-xl md:text-lg text-start w-full sm:w-3/4 md:w-1/2">
            Chordify helps you play your favorite songs effortlessly on guitar,
            ukulele, piano, and mandolin. Join the biggest music community
            today!
          </p>
          <div className="flex sm:flex-row gap-3 sm:gap-0 sm:space-x-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto  p-0 lg:h-10 lg:rounded-md lg:px-6 lg:has-[>svg]:px-4 md:h-10 md:rounded-md md:px-6 md:has-[>svg]:px-4">
              Sign up
            </Button>
            <Button className="text-white border-white hover:bg-white hover:text-teal-600 w-full sm:w-auto  p-0 lg:h-10 lg:rounded-md lg:px-6 lg:has-[>svg]:px-4 md:h-10 md:rounded-md md:px-6 md:has-[>svg]:px-4">
              How it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
