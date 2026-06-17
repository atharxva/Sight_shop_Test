import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./products.module.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, products]);

  const fetchData = () => {
    fetch("http://localhost:8000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const applyFilter = () => {
    if (filter === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === filter
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        <button className={styles.buttons} onClick={() => setFilter("all")}>
          All
        </button>
        <button
          className={styles.buttons}
          onClick={() => setFilter("Sunglasses")}
        >
          Sunglasses
        </button>
        <button
          className={styles.buttons}
          onClick={() => setFilter("Eyeglasses")}
        >
          Eyeglasses
        </button>
        <button
          className={styles.buttons}
          onClick={() => setFilter("Contact Lenses")}
        >
          Contact Lenses
        </button>
      </div>

      <div className={styles.grid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <Link
              key={index}
              to={`/products/${product._id}`}
              className={styles.card}
            >
              <div className={styles.product}>
                <img src={product.imageUrl} alt={product.name} />
                <div className={styles.details}>
                  <h2>{product.name}</h2>
                  <p className={styles.price}>₹{product.price}</p>
                  <p>{product.description}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Products;