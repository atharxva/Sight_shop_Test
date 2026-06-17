import userModel from "../database/datamodels/user.js";

async function getAuth(req, res) {
  const { email, firebaseUid } = req.body;
  console.log(req.body);
  try {
    const user = await userModel.findOne({ firebaseUid });
    if (user) {
      user.email = email;
      user.firebaseUid = firebaseUid;

      await user.save();
    } else {
      const newUser = new userModel({ firebaseUid, email });
      await newUser.save();
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateData(req, res) {
  const { firebaseUid, fname, lname, gender } = req.body;
  console.log(req.body);
  try {
    const user = await userModel.findOneAndUpdate(
      { firebaseUid },
      { fname, lname, gender },
      { new: true }
    );
    if (user) {
      res.json({ message: "User updated successfully", user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}

export default getAuth;
