import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import Searchbar from "./searchbar";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Sight-Store
      </div>

      <div className={styles.searchbar}>
        <Searchbar />
      </div>

      <div className={styles.cartContainer}>
        <Link to="/products">
          <div className={styles.products}>
            <img src="./src/assets/sunglasses_3041928.png" alt="Products"></img>
          </div>
        </Link>

        <Link to="/doctors">
          <div className={styles.doctors}>
            <img src="./src/assets/eye-test_17085233.png" alt="Doctors"></img>
          </div>
        </Link>

        <Link to="/cart">
          <div className={styles.cart}>
            <img src="./src/assets/remove_13925374.png" alt="Cart"></img>
          </div>
        </Link>
      </div>

      {user ? (
        <Link to="/profile" className={styles.profileLink}>
          <div className={styles.profile}>
            <img src="./src/assets/user_17740832.png" alt="Profile"></img>
          </div>
        </Link>
      ) : (
        <Link to="/login" className={styles.profileLink}>
          <div className={styles.profile}>
            <img src="./src/assets/user_17740832.png" alt="Login"></img>
          </div>
        </Link>
      )}
    </header>
  );
};

export default Header;
