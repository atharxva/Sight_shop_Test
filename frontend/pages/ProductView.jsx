import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Addtocart from "../components/Addtocart";
import "./productview.css";

function ProductView() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Product</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>The requested product could not be found.</p>
      </div>
    );
  }

  // Mock data for additional images (replace with actual data from your model)
  const additionalImages = [
    product.imageUrl,
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  return (
    <div className="page-container">
      <div className="product-container">
        <div className="product-image-section">
          <div className="main-image-container">
            <img
              src={additionalImages[selectedImage]}
              alt={product.name}
              className="main-image"
            />
          </div>
          <div className="image-gallery">
            {additionalImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'selected' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-details-section">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-meta">
              <span className="product-category">{product.category}</span>
              <span className="product-brand">{product.brand}</span>
            </div>
          </div>

          <div className="product-pricing">
            <h2 className="product-price">₹{product.price}</h2>
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="discount-badge">{product.discount}% OFF</span>
            )}
          </div>

          <div className="product-info">
            <h3>Product Description</h3>
            <p className="product-description">{product.description}</p>
            
            {product.features && (
              <div className="product-features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-specs">
              <h3>Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Brand</span>
                  <span className="spec-value">{product.brand || 'N/A'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Stock</span>
                  <span className="spec-value">In Stock</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-section">
            <div className="stock-info">
              <span className="stock-status in-stock">
                In Stock
              </span>
              <span className="stock-count">
                Available
              </span>
            </div>
            
            <Addtocart productId={params.id} />

            <div className="shipping-info">
              <div className="shipping-item">
                <i className="fas fa-truck"></i>
                <span>Free Delivery</span>
              </div>
              <div className="shipping-item">
                <i className="fas fa-undo"></i>
                <span>30-Day Returns</span>
              </div>
              <div className="shipping-item">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
