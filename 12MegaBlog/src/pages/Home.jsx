import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents);
            }
        });
    }, []);

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-slate-100">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white">
                    <Container>
                        <div className="py-24 text-center">
                            <h1 className="text-6xl font-extrabold mb-6">
                                Welcome to MegaBlog
                            </h1>

                            <p className="text-xl max-w-3xl mx-auto text-blue-100">
                                Read inspiring stories, share your ideas, and
                                connect with writers around the world.
                            </p>

                           
                        </div>
                    </Container>
                </section>

                {/* Features */}
                <section className="py-20">
                    <Container>
                        <h2 className="text-4xl font-bold text-center mb-14">
                            Why Choose MegaBlog?
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">

                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">
                                <div className="text-5xl mb-4">✍️</div>
                                <h3 className="text-2xl font-bold mb-3">
                                    Write
                                </h3>
                                <p className="text-gray-600">
                                    Publish beautiful articles using a rich text editor.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">
                                <div className="text-5xl mb-4">📷</div>
                                <h3 className="text-2xl font-bold mb-3">
                                    Upload Images
                                </h3>
                                <p className="text-gray-600">
                                    Make every blog attractive with featured images.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition">
                                <div className="text-5xl mb-4">🌍</div>
                                <h3 className="text-2xl font-bold mb-3">
                                    Share
                                </h3>
                                <p className="text-gray-600">
                                    Reach readers from all over the world instantly.
                                </p>
                            </div>

                        </div>
                    </Container>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <Container>

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-slate-800">
                        Latest Articles
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Explore the newest blogs from our community.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {posts.map((post) => (
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>

            </Container>
        </div>
    );
}

export default Home;