import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#232F3E] text-[#DDD]">
      
      {/* Top Links Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Get to Know Us */}
        <div>
          <h3 className="font-semibold text-white mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Press Releases</li>
            <li className="hover:text-white cursor-pointer">Amazon Science</li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
          <div className="flex gap-4">
            <Facebook className="hover:text-white cursor-pointer" />
            <Instagram className="hover:text-white cursor-pointer" />
            <Twitter className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Make Money With Us */}
        <div>
          <h3 className="font-semibold text-white mb-4">Make Money With Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Sell on ShopEase</li>
            <li className="hover:text-white cursor-pointer">Become an Affiliate</li>
            <li className="hover:text-white cursor-pointer">Advertise Your Products</li>
            <li className="hover:text-white cursor-pointer">Fulfillment</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold text-white mb-4">Let Us Help You</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Your Account</li>
            <li className="hover:text-white cursor-pointer">Returns Centre</li>
            <li className="hover:text-white cursor-pointer">100% Purchase Protection</li>
            <li className="hover:text-white cursor-pointer">Help</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#131A22] py-6 text-center text-sm">
        <p className="text-gray-400">
          © {new Date().getFullYear()} ShopEase.com, Inc. or its affiliates
        </p>
        <p className="text-gray-500 mt-1">
          Made with ❤️ by Santanu
        </p>
      </div>
    </footer>
  );
};

export default Footer;
