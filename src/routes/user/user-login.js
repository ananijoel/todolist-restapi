const { user } = require('../../dataBase/sequelize');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const privateKey = require('../../authentification/privatekey')

module.exports = (app) => {
  app.post('/api/user-login', (req, res) => {

    user.findOne({ where: { username: req.body.username } }).then(user => {

      if(!user) {
        const message = `L'utilisateur demandé n'existe pas.`
        return res.status(404).json({ message ,ok:false}) 
      }

      return bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
        if(!isPasswordValid) {
          const message = `Le mot de passe est incorrect.`
          return res.status(401).json({message,ok:false})
        }

        // Générer un jeton JWT valide pendant 24 heures.
        const token = jwt.sign(
          { userId: user.id },
          privateKey,
          { expiresIn: '31d' }
        );

        const message = `L'utilisateur a été connecté avec succès`;
        return res.json({ message, token,userId: user.id,ok:true})
      })
    })
    .catch(error => {
      const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`
      res.status(500).json({ message, data: error })
    })
  })
}