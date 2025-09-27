import api from "../utils/baseUrl";

interface address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  number: string;
}

interface items {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

const token = localStorage.getItem("auth_token");
export const getCheckout = async (
  amount: number,
  currency: string = "INR",
  address: address,
  items: Array<items>
) => {
  const response = await api.post(
    "/api/user/order/create-order",
    {
      amount,
      currency,
      address,
      items,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// /api/user/oraderPaymentUpdate
export const oraderPaymentUpdate = async (orderId: string, status: string) => {
  const token = localStorage.getItem("auth_token");
  const response = await api.put(
    "/api/user/order/orderPaymentUpdate",
    { orderId, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const listAddress = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await api.get("/api/user/order/address", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const allOrderList = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await api.get("/api/user/order/getAllOrderedList", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const orderTrackingDetails = async (orderId: string) => {
  const response = await api.get(
    `/api/user/order/orderTrackingDetails/?id=${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
