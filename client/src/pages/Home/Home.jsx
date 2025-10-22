import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900">Welcome to the MERN Blog!</h1>
      <p className="mt-3 text-xl text-gray-600">Explore our latest posts and share your thoughts.</p>
      <div className="mt-8">
        <a href="/blog" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          View Blog Posts
        </a>
      </div>
    </div>
  );
};

export default Home;