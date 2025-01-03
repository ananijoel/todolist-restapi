const {Sequelize,DataTypes} = require('sequelize')
todo_model = require('../models/todo')
user_model = require('../models/user')
let sequelize = null
let demo = false

if(process.env.NODE_ENV === 'production'){
    sequelize = new Sequelize('ulrihrpy_anatide', 'ulrihrpy_anatide', '775SGnvmdesEKk9RAKN9mk3Y', {
       host: 'localhost',
       port: 3306,
       dialect: 'mariadb',
       dialectOptions: {
         timezone: 'Etc/GMT',
       },
       logging: false
     })
} else {
    sequelize = new Sequelize('todolist', 'root', '', {
       host: 'localhost',
       dialect: 'mariadb',
       dialectOptions: {
         timezone: 'Etc/GMT',
       },
       logging: false
     })
}

const Todo = todo_model(sequelize,DataTypes)
const user = user_model(sequelize,DataTypes)

let init_dataBase
init_dataBase = () => {
  return sequelize.sync(
    {force:true}
  ).then(() => {
    console.log('La base de données a bien été initialisée !');
  });
  }

module.exports = { init_dataBase, Todo,user }