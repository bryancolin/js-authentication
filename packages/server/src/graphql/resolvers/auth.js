const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  users: async () => {
    try {
      const users = await User.find().populate("createdEvents");
      return users;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });

      if (existingUser) {
        throw new Error("User exists already.");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  },

  login: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.email });

      if (!existingUser) {
        throw new Error("User does not exists.");
      }

      const isEqual = await bcrypt.compare(
        args.password,
        existingUser.password
      );

      if (!isEqual) {
        throw new Error("Password is incorrect!");
      }

      const token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        "somesupersecretkey",
        { expiresIn: "1h" }
      );

      return { userId: existingUser.id, token: token, tokenExpiration: 1 };
    } catch (error) {
      throw error;
    }
  },
};
