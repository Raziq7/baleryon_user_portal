import React, { useEffect, useState } from "react";
import { allOrderList } from "../../api/checkoutApi";

interface OrderItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  address: string;
  paymentStatus: string;
  receipt: string;
  isPaid: boolean;
  isDelivered: boolean;
  deliveryStatus: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const getStatusStep = (status: string): number => {
  switch (status.toLowerCase()) {
    case "pending":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
};

const UserOrdersPage: React.FC = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);

  const fetchOrderList = async () => {
    try {
      const res = await allOrderList();
      if (res.success === true) {
        setOrderList(res.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Track Your Orders</h1>
      {orderList.length === 0 ? (
        <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orderList.map((order) => {
            const currentStep = getStatusStep(order.deliveryStatus);

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-4 border-b pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-gray-600">Items Summary:</p>
                  <ul className="text-sm text-gray-700 list-disc list-inside mt-1">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.quantity} × {item.color}, Size {item.size}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm">
                    Total: <span className="font-semibold">${order.amount.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Estimated Delivery:{" "}
                    <span className="font-semibold">
                      {new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {/* Delivery Progress Bar */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Delivery Status</p>
                  <div className="flex items-center justify-between w-full max-w-xl">
                    {["Pending", "Processing", "Shipped", "Delivered"].map((label, index) => (
                      <div key={label} className="flex-1 relative">
                        <div
                          className={`w-4 h-4 rounded-full mx-auto z-10 ${
                            index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        ></div>
                        {index < 3 && (
                          <div
                            className={`absolute top-1/2 left-1/2 h-1 w-full transform -translate-x-1/2 -translate-y-1/2 ${
                              index < currentStep ? "bg-blue-600" : "bg-gray-300"
                            }`}
                          ></div>
                        )}
                        <p className="text-xs text-center mt-2">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
