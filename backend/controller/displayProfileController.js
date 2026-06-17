import userModel from "../database/datamodels/user.js";

async function displayProfile(req, res) {
  const { user } = req.params;
  const profile = await userModel.findOne({ _id: user });
  res.send(profile);
}

export default displayProfile;
