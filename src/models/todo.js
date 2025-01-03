const {Sequelize,Datatypes} = require('sequelize')
module.exports = (sequelize,DataTypes) => {
    return sequelize.define('todo',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        userid:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        completed:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
        }
    },{
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'update'
      })
}