import React from 'react'
function P() {
  return (
<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-3xl mx-auto">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
    </div>

    <div className="bg-white shadow rounded-lg p-8">
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            // className='bg-black text-white'
          >
            Send Message
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Our Office</h3>
            <p className="mt-2 text-gray-600">
              mathikere,Bangalore<br />
              karnataka<br />
              india, 560054
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Contact Info</h3>
            <p className="mt-2 text-gray-600">
              Email: info@baleryon.com<br />
              Phone: (555) 123-4567<br />
              Hours: Mon-Fri 9am-5pm 
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default P