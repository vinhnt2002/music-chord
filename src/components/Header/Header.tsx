"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaGift } from "react-icons/fa";
import { FiMenu, FiSearch, FiUpload, FiX } from "react-icons/fi";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { onOpen } = useModal();

  const navItems = [
    { href: "/discover", label: "Discover" },
    { href: "/my-library", label: "My library" },
    { href: "/pricing", label: "Pricing" },
    { href: "/toolkit", label: "Toolkit" },
    { href: "/blog", label: "Blog" },
    { href: "/setlists", label: "Setlists" },
    { href: "/help", label: "Help" },
  ];

  return (
    <>
      <header className="w-full bg-[#0A8282] text-white shadow-md">
        {/* Mobile Header */}
        <div className="container mx-auto px-4 py-3 flex md:hidden items-center justify-between">
          {/* Search Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="text-white"
          >
            <FiSearch className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="text-2xl font-bold text-center">
            <Link href="/">chordify</Link>
          </div>

          {/* Profile Icon */}
          <div className="flex items-center gap-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback>Kiet</AvatarFallback>
            </Avatar>

            {/* Burger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Conditional */}
        {mobileSearchOpen && (
          <div className="px-4 py-2 bg-[#086868] md:hidden">
            <div className="relative">
              <Input
                type="text"
                placeholder="search any song"
                className="w-full pl-10 pr-4 py-2 rounded-md placeholder:text-white text-white bg-[#086868] border-none"
                autoFocus
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                <FiSearch className="w-5 h-5" />
              </span>
            </div>
          </div>
        )}

        {/* Mobile Menu - Conditional */}
        {mobileMenuOpen && (
          <div className="bg-[#0A8282] md:hidden py-4 px-4 shadow-lg">
            <Button
              variant="outline"
              className="w-full mb-4 text-white bg-[#086868] outline-none border-none hover:bg-[#075757]"
            >
              <FiUpload className="w-4 h-4 mr-2" />
              Upload song
            </Button>

            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-all duration-200 font-semibold hover:underline ${
                    pathname === item.href ? "underline" : "text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#086868] flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm mr-2">Kiet</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-400">
                <FaGift className="w-4 h-4" />
                <span>0/4</span>
              </div>
            </div>
          </div>
        )}

        {/* Tablet and Desktop Header */}
        <div className="hidden md:flex container mx-auto px-4 py-2 flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link href="/">chordify</Link>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative w-full lg:w-auto lg:max-w-md">
              <Input
                type="text"
                placeholder="search any song"
                className="w-full pl-10 pr-4 py-2 rounded-md placeholder:text-white text-white bg-[#086868] border-none"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                <FiSearch className="w-5 h-5" />
              </span>
            </div>

            {/* Navigation and Upload Button */}
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Upload Button */}
              <Button
                variant="outline"
                className="w-full lg:w-auto text-white bg-[#086868] outline-none border-none hover:bg-[#075757]"
              >
                <FiUpload className="w-4 h-4 mr-2" />
                Upload song
              </Button>

              {/* Navigation Links */}
              <nav className="flex flex-wrap justify-center lg:justify-start gap-4 lg:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-all duration-200 font-semibold hover:underline ${
                      pathname === item.href ? "underline" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-1 cursor-pointer">
              <p
                className="font-semibold"
                onClick={() => onOpen("authModal", {})}
              >
                Sign In
              </p>
              <span>|</span>
              <p
                className="font-semibold"
                onClick={() => onOpen("authModal", {})}
              >
                Sign Up
              </p>
            </div>

            {/* <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>Kiet</AvatarFallback>
          </Avatar> */}
            {/* <span className="text-sm">Kiet</span> */}
            <div className="flex items-center space-x-1 text-yellow-400">
              <FaGift className="w-4 h-4" />
              <span>0/4</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
