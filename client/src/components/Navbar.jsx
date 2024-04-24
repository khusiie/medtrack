import React from "react";
import medtak from "../assests/medtak.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white h-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="mr-2 overflow-hidden">
          <img src={medtak} alt="Calendly" className="h-[85px] w-auto" />
        </div>
        <div className="hidden sm:block">
          <ul className="flex space-x-8">
            <Link to="/">
              {" "}
              <li>Home</li>
            </Link>
            <Link to="aiconsole">
              <li>AI Help</li>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
