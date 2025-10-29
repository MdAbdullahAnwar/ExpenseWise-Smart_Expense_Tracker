const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
});

ForgotPasswordRequest.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(ForgotPasswordRequest);

module.exports = ForgotPasswordRequest;
