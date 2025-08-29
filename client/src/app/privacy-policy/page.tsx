function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-6">
              We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-6">
              We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.
            </p>

            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-6">
              We do not sell or share your personal information with third parties except as described in this privacy policy or with your consent.
            </p>

            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.
            </p>

            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-6">
              You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your information.
            </p>

            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
            </p>

            <div className="text-sm text-gray-500 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy