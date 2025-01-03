const { user } = require('../../dataBase/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');
const auth = require('../../authentification/auth');

module.exports = (app) => {
  app.put('/api/update-user-byid/:id', auth, async (req, res) => {
    const id = req.params.id; // Identifiant de l'utilisateur à mettre à jour
    const { password, ...otherDetails } = req.body; // Exclure le mot de passe des autres détails

    try {
      // Vérifier si l'utilisateur existe avant la mise à jour
      const existingUser = await user.findOne({ where: { id } });

      if (!existingUser) {
        const message = `L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant.`;
        return res.status(404).json({ message });
      }

      // Hashage du mot de passe si fourni
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        otherDetails.password = hashedPassword;
      }

      // Mettre à jour l'utilisateur
      await user.update(otherDetails, { where: { id } });

      // Récupérer les détails mis à jour
      const updatedUser = await user.findOne({ where: { id } });

      const message = `L'utilisateur ${updatedUser.id} a bien été modifié.`;
      return res.json({ message, data: updatedUser });

    } catch (error) {
      if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: error.message });
      }

      const message = `Une erreur est survenue lors de la mise à jour de l'utilisateur.`;
      res.status(500).json({ message, data: error.message });
    }
  });
};
