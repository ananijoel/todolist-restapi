const {Todo} = require('../../dataBase/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../../authentification/auth')
module.exports = (app) => { 
    app.delete('/api/remove-todo/:id', async (req, res) => {
        Todo.findByPk(req.params.id)
        .then(Todo =>{
            if(Todo == null){
                const message = 'todo not found'
                return res.status(404).json({message})
            }

            return Todo.destroy({ where: { id: Todo.id } })
            .then(_=>{
                const message = 'todo removed'
                res.json({message})
            })
            .catch(error => {
                const message = `L'item n'a pas pu être supprimé. Réessayez dans quelques instants.`
                res.status(500).json({ message, data: error })
              })
        })
    })
}