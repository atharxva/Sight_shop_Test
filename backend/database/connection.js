import mongoose from "mongoose";

function connect() {
  mongoose
    .connect("mongodb://localhost:27017/lenskart")
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Error connecting to the database", err.message);
    });
}

export default connect;
