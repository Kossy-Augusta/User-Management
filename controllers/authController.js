const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");

class UserController {
  async create(req, res) {
    try {
      const { email, first_name, last_name, password } = req.body;
      // check for duplicate
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser)
        return res
          .status(409)
          .send({ error: true, message: "Email is already taken" });
      const hashpwd = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        first_name,
        last_name,
        password: hashpwd,
      });
      const data = {
        _id: newUser._id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      };
      sendResponse(res, 201, `New user created!!`, data);
    } catch (err) {
      console.log(err.message);
      res.status(err.status || 500).json({ error: true, message: err.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    // check if user exist
    try {
      const currentUser = await User.findOne({ email }).exec();
      if (!currentUser)
        return res
          .status(400)
          .send({ error: true, message: "Unauthorized access" });

      const verifyPassword = await bcrypt.compare(
        password,
        currentUser.password
      );
      if (!verifyPassword)
        return res
          .status(401)
          .send({ error: true, message: "Incorrect password" });
      const roles = currentUser.roles;

      // create JWT
      const accessToken = jwt.sign(
        {
          userInfo: {
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      const refreshToken = jwt.sign(
        {
          userInfo: {
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            roles: roles,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // save refresh token to db with current user

      currentUser.refresh_token = refreshToken;
      await currentUser.save();
      // set the cookie with  the refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      const data = [
        { access_token: accessToken },
        {
          _id: currentUser._id,
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
        },
      ];
      sendResponse(res, 200, `User login Successful`, data);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      sendResponse(res, statusCode, error.message, null, true);
    }
  }

  async logout(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(400).send({ message: "No cookie found" });
    const refreshToken = cookies.jwt;
    try {
      const currentUser = await User.findOne({
        refresh_token: refreshToken,
      }).exec();

      if (!currentUser) {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          // secure: true,
        });
        return res.status(204).send({ message: "User is already logged out" });
      }
      currentUser.refresh_token = "";
      const result = await currentUser.save();
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        // secure: true,
      });
      res.status(200).send({ message: "User logged out succesfully" });
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).send({ message: err.message });
    }
  }
  async refreshToken(req, res){
        const cookies = req.cookies;
        if(!cookies?.jwt) return res.status(400).send({message: "No Cookie Found"});
        const refreshToken = cookies.jwt;
        try{
            const authUser = await User.findOne({refresh_token: refreshToken}).exec();
            if(!authUser) return res.status(403).send({error:true, message: "Forbidden"});
            jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err, decoded) =>{
                if(err){
                    if (err.name === "TokenExpiredError") return res.status(403).send({ error: true, message: "Refresh token expired" });
                    return res.status(403).send({ error: true, message: "Invalid refresh token" });
                }
                console.log(authUser.roles);
                const accessToken = jwt.sign({
                    UserInfo: {
                        first_name: authUser.first_name,
                        last_name: authUser.last_name,
                        roles: authUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "10m"}
                );
                res.status(200).send({accessToken})
            } 
            )
        }catch(err){
            return res.status(err.status || 500).send({ message: err.message || "Internal Server Error" });
        }
    }
}

module.exports = UserController;
