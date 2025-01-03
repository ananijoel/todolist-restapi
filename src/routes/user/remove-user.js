const { user } = require('../../dataBase/sequelize')
const { ValidationError, UniqueConstraintError, where } = require('sequelize')
const auth = require('../../authentification/auth')
module.exports = (app) => {
    app.delete('/api/remove-user/:username',auth,(req,res)=>{
        user.findOne({where:{
            username:req.params.username
        }})
        .then(user => {        
            if(user === null) {
              const message = `L'user demandé n'existe pas. Réessayez avec un autre identifiant.`
              return res.status(404).json({ message })
            }
    
            return user.destroy({ where: { username: user.username } })
            .then(_ => {
              const message = `L'user avec l'identifiant n°${user.id} a bien été supprimé.`
              //res.json({message, data: user })
              res.json({message})
            })
          })
          .catch(error => {
            const message = `L'user n'a pas pu être supprimé. Réessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
          })
    })
}