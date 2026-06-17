import productModel from "../database/datamodels/products.js";

async function searchbar(req, res) {
  const { name } = req.params;

  try {
    console.log(name);
    const products = await productModel.find({
      name: { $regex: name, $options: "i" },
    });
    const plainProducts = products.map((product) => product.toObject());
    console.log(plainProducts);
    res.status(200).json({ products: plainProducts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldnt fetch Data" });
  }
}
export default searchbar;
