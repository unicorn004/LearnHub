// src/ProfilePage.js
import React from 'react';

const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4">
        <img
          src="https://avatars.githubusercontent.com/u/9919?v=4" // Replace with dynamic user avatar
          alt="Profile"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">John Doe</h1>
          <p className="text-gray-600">@johndoe</p>
          <p className="mt-2">Software Engineer at Company</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Bio</h2>
        <p className="text-gray-700">Passionate developer and open-source enthusiast.</p>
      </div>

      <div className="mt-6 flex space-x-4">
        <div className="flex items-center">
          <span className="font-bold">100</span>
          <span className="text-gray-600"> Repositories</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold">200</span>
          <span className="text-gray-600"> Followers</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold">150</span>
          <span className="text-gray-600"> Following</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Repositories</h2>
        <ul className="mt-4 space-y-4">
          <li className="p-4 border rounded-lg shadow">
            <h3 className="font-bold">Repository Name</h3>
            <p className="text-gray-600">Short description of the repository.</p>
            <a href="#" className="text-blue-500">View Repository</a>
          </li>
          <li className="p-4 border rounded-lg shadow">
            <h3 className="font-bold">Another Repository</h3>
            <p className="text-gray-600">Short description of another repository.</p>
            <a href="#" className="text-blue-500">View Repository</a>
          </li>
          {/* Add more repositories as needed */}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;