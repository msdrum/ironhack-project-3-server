import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config()

function generateToken(user) {
  const { _id, name, email, role } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "12h";

  console.log(signature)

  return jwt.sign({ _id, name, email, role }, signature, {
    expiresIn: expiration,
  });
}

export default generateToken;