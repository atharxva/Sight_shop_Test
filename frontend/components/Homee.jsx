import axios from "axios";
import React, { useState, useEffect } from "react";
import "./home.css";

const Homee = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const cartData = await fetch(`http://localhost:8000/checkout/${userId}`);
      const items = await cartData.json();
      setCartItems(items);

      const total = items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const chackoutHandler = async () => {
    try {
      const { data } = await axios.post("http://localhost:8000/api/order", {
        amount: totalAmount,
      });

      const {
        data: { keyId },
      } = await axios.get("http://localhost:8000/api/getkey");

      const options = {
        key_id: keyId,
        amount: totalAmount * 100, // Convert to paise
        currency: "INR",
        name: "Atharva Jadhav",
        description: "Test Transaction",
        image: "",
        order_id: data.order.id,
        callback_url: "http://localhost:8000/api/paymentVerification",
        prefill: {
          name: "Atharva Jadhav",
          email: "atharvajadhavlm10@gmail.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#45D347",
        },
      };

      if (window.Razorpay) {
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        console.error("Razorpay script is not loaded.");
      }
    } catch (error) {
      console.error("Error in Razorpay initialization:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="custom-home">
      <h2 className="custom-title">Your Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <div className="custom-cart-container">
            {cartItems.map((item) => (
              <div key={item.product._id} className="custom-cart-item">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="custom-cart-item-image"
                />
                <div className="custom-cart-item-details">
                  <h3 className="custom-cart-item-title">
                    {item.product.name}
                  </h3>
                  <p>Price: ₹{item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ₹{item.product.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="custom-checkout-container">
            <h3 className="custom-total">Total: ₹{totalAmount.toFixed(2)}</h3>
            <button
              className="custom-checkout-button"
              onClick={chackoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="custom-empty-cart">No items in the cart.</div>
      )}
    </div>
  );
};

export default Homee;
