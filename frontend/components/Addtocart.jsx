import { toast } from 'react-toastify';
import './Addtocart.css';

function Addtocart({ productId }) {
  const addToCart = () => {
    fetch("http://localhost:8000/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localStorage.getItem("userId"),
        product: productId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Cart data:", data);
        toast.success('🛍️ Product added to cart!');
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        toast.error('Failed to add product to cart');
      });
  };

  return (
    <button className="add-to-cart-btn" onClick={addToCart}>
      <span className="cart-icon">🛒</span>
      <span className="btn-text">Add to cart</span>
    </button>
  );
}

export default Addtocart;
