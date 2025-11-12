import React from "react";

export default function CheckoutSummary({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="checkout-summary">
      <h3>Đơn hàng của bạn</h3>
      {cart.map((item, idx) => (
        <div key={idx} className="summary-item">
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>{item.price.toLocaleString()} VNĐ</span>
        </div>
      ))}
      <hr />
      <h4>Tổng cộng: {total.toLocaleString()} VNĐ</h4>
    </div>
  );
}
