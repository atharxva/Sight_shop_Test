import userModel from "../database/datamodels/user.js";

const addressInputController = async (req, res) => {
  const { user } = req.params;
  const address = req.body;
  const userAddress = await userModel.findOneAndUpdate(
    { _id: user },
    { $push: { address: address } }
  );
  res.send(userAddress);
};

export default addressInputController;
