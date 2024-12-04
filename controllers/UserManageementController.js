const User = require("../model/User");

class UserManagement {
  async delete(req, res) {
    const id = req.params.id;
    if (!id) return res.status(400).send({ message: "Id is required" });
    try {
      const userToDelete = await User.findById(id).exec();
      if (!userToDelete)
        return res.status(404).send({ message: "User not Found" });
      const result = await userToDelete.deleteOne({ _id: id });
      return res.status(204).send({ message: "User deleted Succesfully" });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).send({ message: error.message });
    }
  }
}

module.exports = UserManagement;
