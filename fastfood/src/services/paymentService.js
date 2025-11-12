export async function processPayment(paymentData, cart) {
  console.log("🧾 Payment info:", paymentData);
  console.log("🛍️ Cart info:", cart);

  // mô phỏng gọi API thật (ví dụ VNPay, Stripe,…)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1500);
  });
}
