import { Model } from "sequelize";

class User extends Model {}

const UserModel = (sequelize, DataTypes) => {
  User.init(
    {
      clientHashedUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      reHashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      encryptedData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

export default UserModel;
