const {Todo} = require('../../dataBase/sequelize')
const auth = require('../../authentification/auth')

module.exports = (app) => { 
    app.put('/api/check-todo/:id', async (req, res) => {
        Todo.findByPk(req.params.id)
        .then(Todo =>{
            if(Todo == null){
                const message = 'todo not found'
                return res.status(404).json({message})
            }

            return Todo.update({completed: !Todo.completed}, { where: { id: Todo.id } })
            .then(_=>{
                const message = 'todo updated'
                res.json({message})
            })
            .catch(error => {
                const message = `L'item n'a pas pu être mis à jour. Réessayez dans quelques instants.`
                res.status(500).json({ message, data: error })
              })
        })
    })
}