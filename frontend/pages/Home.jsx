import React from "react";
import styles from "./home.module.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src="./src/assets/homepage.png" alt="home" />
        </div>
        <div className={styles.textContainer}>
          <h1>See the world </h1>
          <h1> your way</h1>
          <Link to="/products"><button className={styles.explorebtn}>Explore</button></Link>
        </div>
      </div>
    </div>
  );
}
export default Home;
