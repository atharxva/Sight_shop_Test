import React, { useState, useEffect } from "react";

function Checkout({ cartItems, totalAmount, chackoutHandler }) {
  return (
    <div>
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <h3>Cart Items:</h3>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product.id} className="cart-item">
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>Price: {item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <h4>Total Amount: {totalAmount}</h4>

          {/* Trigger the checkout handler passed as a prop */}
          <button onClick={chackoutHandler}>Proceed to Payment</button>
        </>
      )}
    </div>
  );
}

export default Checkout;
