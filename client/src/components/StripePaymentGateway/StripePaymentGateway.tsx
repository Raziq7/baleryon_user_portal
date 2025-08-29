// import React from "react";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import PaymentForm from "../PaymentForm/PaymentForm";

// // Replace this with your actual Stripe test publishable key
// const PUBLIC_KEY =
//   "pk_test_51JbnlbHIe5PAtemOzeZpQObJwT0G4mVw77iaWSVU4enN0ZVjtYJYk836bKWdGnv2TU643kixoIlAbJjX4vkJMbWc00lVgyrvDw";

// const stripePromise = loadStripe(PUBLIC_KEY);

// const StripePaymentGateway: React.FC = () => {
//   return (
//     <div className="w-full max-w-md mx-auto p-4">
//       <Elements stripe={stripePromise}>
//         <PaymentForm />
//       </Elements>
//     </div>
//   );
// };

// export default StripePaymentGateway;