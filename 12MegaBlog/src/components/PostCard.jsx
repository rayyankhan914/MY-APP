import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
    return (
        <Link to={`/post/${$id}`}>
            <div className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

                {/* Image */}
                <div className="overflow-hidden">
                    <img
                        src={appwriteService.getFilePreview(featuredImage).toString()}
                        alt={title}
                        className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Content */}
                <div className="p-5">

                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        BLOG
                    </span>

                    <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">
                        {title}
                    </h2>

                    <p className="text-gray-500 mt-3 text-sm">
                        Read this amazing article and discover something new.
                    </p>

                    <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition hover:opacity-90">
                        Read More →
                    </button>

                </div>
            </div>
        </Link>
    );
}

export default PostCard;