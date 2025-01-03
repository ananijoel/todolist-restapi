const { user } = require('../../dataBase/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');
const auth = require('../../authentification/auth')
module.exports = (app) => {
  app.put('/api/update-user/:username',auth, async (req, res) => {
    const name = req.params.username;
    const { password, ...otherDetails } = req.body; // Exclure le mot de passe des autres détails
    const new_name = req.body.username 

    try {
      // Vérifier si l'utilisateur existe avant la mise à jour
      const existingUser = await user.findOne({ where: { username: name } });

      if (!existingUser) {
        const message = `L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant.`;
        return res.status(404).json({ message });
      }

      // Mettre à jour l'utilisateur
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword, ...otherDetails }, { where: { username: name } });
      } else {
        await user.update(otherDetails, { where: { username: name } });
      }

      // Récupérer les détails mis à jour
      const updatedUser = await user.findOne({ where: { username: new_name } });

      const message = `L'utilisateur ${updatedUser.username} a bien été modifié.`;
      //res.json({ message, data: updatedUser });
      res.json({ message });

    } catch (error) {
      if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: error.message });
      }

      const message = `Une erreur est survenue lors de la mise à jour de l'utilisateur.`;
      res.status(500).json({ message, data: error.message });
    }
  });
};
