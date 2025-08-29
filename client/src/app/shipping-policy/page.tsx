function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Shipping Policy
        </h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Processing Time</h2>
                <p className="text-gray-600">All orders are processed within 1-2 business days after receiving your order confirmation email.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Shipping Methods & Delivery Time</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Standard Shipping (5-7 business days)</li>
                  <li>Express Shipping (2-3 business days)</li>
                  <li>International Shipping (10-14 business days)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Shipping Rates</h2>
                <p className="text-gray-600">Shipping rates are calculated based on the delivery location and the weight of your order. The exact shipping cost will be calculated at checkout.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Order Tracking</h2>
                <p className="text-gray-600">Once your order ships, you will receive a tracking number via email to monitor your package&apos;s status.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingPolicy