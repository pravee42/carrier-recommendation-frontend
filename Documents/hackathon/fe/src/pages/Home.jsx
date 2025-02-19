import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">Welcome to Career Recommender</h1>
            <Link to="/form" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Get Started</Link>
        </div>
    );
};

export default Home;
