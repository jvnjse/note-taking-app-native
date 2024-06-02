// models.js
const { Sequelize, DataTypes } = require("sequelize");

// Create a new Sequelize instance and connect to your SQL database
const sequelize = new Sequelize("mydb", "jvn", "123", {
  host: "localhost",
  dialect: "mysql",
  dialectModule: require("mysql2"), // Add this line to specify mysql2
});

// Define the User model
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the Note model
const Note = sequelize.define("Note", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});

// Define the association between User and Note models
User.hasMany(Note);
Note.belongsTo(User);

// Sync the models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database and models synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing database and models:", err);
  });

module.exports = { User, Note };
