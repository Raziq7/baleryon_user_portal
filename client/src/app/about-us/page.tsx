import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Baleryon
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            We are passionate about creating innovative solutions
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Our Mission</h3>
              <p className="mt-2 text-gray-600">
                To deliver exceptional value through cutting-edge technology
                solutions.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Our Vision</h3>
              <p className="mt-2 text-gray-600">
                To become a global leader in innovative software solutions.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Our Values</h3>
              <p className="mt-2 text-gray-600">
                Innovation, integrity, and excellence in everything we do.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Our Story</h3>
            <p className="mt-2 text-gray-600">
              Founded with a vision to transform the digital landscape, Baleryon
              has grown into a trusted partner for businesses seeking innovative
              solutions. Our team of dedicated professionals works tirelessly to
              deliver excellence in every project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
