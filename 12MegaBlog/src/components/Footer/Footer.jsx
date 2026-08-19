import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300">
            {/* Top Border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Logo */}
                    <div>
                        <Logo width="140px" />

                        <p className="mt-5 text-gray-400 leading-7">
                            MegaBlog is a modern blogging platform where you can
                            share your thoughts, stories, and ideas with the
                            world.
                        </p>

                        <div className="flex gap-4 mt-6 text-2xl">
                            <span className="hover:scale-110 cursor-pointer">🌐</span>
                            <span className="hover:scale-110 cursor-pointer">📘</span>
                            <span className="hover:scale-110 cursor-pointer">🐦</span>
                            <span className="hover:scale-110 cursor-pointer">📸</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-6">
                            Quick Links
                        </h3>

                        <ul className="space-y-4">
                            <li><Link className="hover:text-blue-400" to="/">Home</Link></li>
                            <li><Link className="hover:text-blue-400" to="/all-posts">All Posts</Link></li>
                            <li><Link className="hover:text-blue-400" to="/add-post">Write Blog</Link></li>
                            <li><Link className="hover:text-blue-400" to="/login">Login</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-6">
                            Resources
                        </h3>

                        <ul className="space-y-4">
                            <li><Link className="hover:text-blue-400" to="/">Help Center</Link></li>
                            <li><Link className="hover:text-blue-400" to="/">Privacy Policy</Link></li>
                            <li><Link className="hover:text-blue-400" to="/">Terms & Conditions</Link></li>
                            <li><Link className="hover:text-blue-400" to="/">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white text-xl font-bold mb-6">
                            Stay Updated
                        </h3>

                        <p className="text-gray-400 mb-5">
                            Subscribe to receive the latest articles and updates.
                        </p>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <button className="w-full mt-4 rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700 transition">
                            Subscribe
                        </button>
                    </div>

                </div>

                {/* Bottom */}
                <div className="border-t border-slate-700 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center">

                    <p className="text-gray-500">
                        © {new Date().getFullYear()} MegaBlog. All Rights Reserved.
                    </p>

                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link className="hover:text-blue-400" to="/">
                            Privacy
                        </Link>

                        <Link className="hover:text-blue-400" to="/">
                            Terms
                        </Link>

                        <Link className="hover:text-blue-400" to="/">
                            Contact
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}

export default Footer;