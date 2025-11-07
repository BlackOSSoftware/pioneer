"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white font-bold rounded-lg w-8 h-8 flex items-center justify-center text-lg">
            P
          </div>
          <span className="text-lg font-semibold text-gray-800">Pioneer Wealth</span>
        </Link>

        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          <Link href="/Services" className="text-gray-700 hover:text-blue-600">Services</Link>
          <Link href="/Product" className="text-gray-700 hover:text-blue-600">Products</Link>
          <Link href="/Insurance" className="text-gray-700 hover:text-blue-600">Insurance</Link>
          <Link href="/financial-planning" className="text-gray-700 hover:text-blue-600">Financial Planning</Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col items-center py-4 space-y-3">
            <Link href="/" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/Product" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link href="/Insurance" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Insurance</Link>
            <Link href="/financial-planning" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Financial Planning</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
