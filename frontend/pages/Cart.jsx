import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./cart.css";

function Cart() {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State variable for total price

  useEffect(() => {
    fetch("http://localhost:8000/cart/" + localStorage.getItem("userId"))
      .then((response) => response.json())
      .then((data) => {
        console.log("Cart data:", data);
        setProducts(data);
        // Calculate total price on data update
        setTotalPrice(
          data.reduce((acc, product) => acc + product.product.price * product.quantity, 0)
        );
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, []);

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      {products.length > 0 ? (
        <ul className="cart-items">
          {products.map((product) => (
            <li key={product._id} className="cart-item">
              <div className="product-image">
                <img
                  src={product.product.imageUrl}
                  alt={product.product.name}
                />
              </div>
              <div className="product-details">
                <h2>{product.product.name}</h2>
                <p>Price: ₹{product.product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Total: ₹{product.product.price * product.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className="checkout">
        <p className="total-price">
          Total: ₹{totalPrice.toFixed(2)} {/* Display formatted total price */}
        </p>
        <Link to="/payment">
          <button>Proceed to Checkout</button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;