import React, { useState } from "react";
import styles from "./searchbar.module.css";
import { Link } from "react-router-dom";

function Searchbar() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:8000/search/" + input)
      .then((response) => response.json())
      .then((json) => {
        setResults(json.products);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setInput("");
      setResults([]);
      return;
    }

    setInput(value);
    fetchData();
  };

  return (
    <div className={styles.searchbar}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Search EyeWear"
        className={styles.input}
      />

      {/* Dropdown for search results */}
      {results.length > 0 && (
        <ul className={styles.dropdown}>
          {results.map((product) => (
            <li key={product._id} className={styles.dropdownItem}>
              <Link to={`/products/${product._id}`} className={styles.link}>
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Searchbar;
