import UserModel from "../model/user.model.js";

async function attachCurrentUser(req, res, next) {
  try {
    const userData = req.auth;

    const user = await UserModel.findOne(
      { _id: userData._id },
      { passwordHash: 0 }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    req.currentUser = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
}

export default attachCurrentUser;