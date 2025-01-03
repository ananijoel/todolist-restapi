module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
            msg:`le nom est deja pris`
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
            msg:`le nom est deja pris`
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      picture:{
        type: DataTypes.BLOB('long'),
        allowNull: true
      }
    })
  }