import cartModel from "../database/datamodels/cart.js";

async function addToCartController(req, res) {
  try {
    const { user, product } = req.body;

    console.log(user);

    const existingCartItem = await cartModel.findOne({
      user: user,
      product: product,
    });

    if (existingCartItem) {
      existingCartItem.quantity = (existingCartItem.quantity || 1) + 1;
      await existingCartItem.save();
      return res.send({ message: "Product quantity updated in cart" });
    } else {
      const cartItem = {
        user: user,
        product: product,
        quantity: 1,
      };

      const cart = new cartModel(cartItem);
      await cart.save();
      return res.send({ message: "Product added to cart" });
    }
  } catch (error) {
    console.error("Error in addToCartController:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

export default addToCartController;
