const {Todo} = require('../../dataBase/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../../authentification/auth')
module.exports = (app) => {
    app.post('/api/add-todo',auth, async (req, res) => {
        Todo.create(req.body)
        .then(Todo =>{
            const message = 'todo created'
            res.json({message, Todo})
        })
        .catch(error => {
            if(error instanceof ValidationError) {
              return res.status(400).json({ message: error.message, data: error });
            }
            if(error instanceof UniqueConstraintError) {
              return res.status(400).json({ message: 'error.message', data: error });
            }
            const message = `Le todo n'a pas pu être ajouté. Réessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
          })
    })
}