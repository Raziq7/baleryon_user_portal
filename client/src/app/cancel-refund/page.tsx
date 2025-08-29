function CancelRefund() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Cancellation & Refund Policy
            </h1>
            
            <div className="prose prose-sm text-gray-600">
              <h2 className="text-xl font-semibold mb-4">Cancellation Policy</h2>
              <p className="mb-4">
                You can cancel your order within 24 hours of purchase. To initiate a cancellation,
                please contact our customer support team.
              </p>

              <h2 className="text-xl font-semibold mb-4">Refund Policy</h2>
              <p className="mb-4">
                Refunds will be processed within 5-7 business days after approval.
                The refund amount will be credited back to the original payment method.
              </p>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-4">Need Help?</h3>
                <p className="mb-4">
                  If you have any questions about our cancellation or refund policies,
                  please don&apos;t hesitate to contact us:
                </p>
                <ul className="list-disc pl-5 mb-4">
                  <li>Email: support@baleryon.com</li>
                  <li>Phone: 1-800-123-4567</li>
                  <li>Hours: Monday to Friday, 9 AM - 5 PM EST</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancelRefund