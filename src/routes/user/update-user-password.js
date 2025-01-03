const { user } = require('../../dataBase/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');
const auth = require('../../authentification/auth');

module.exports = (app) => {
  app.put('/api/update-user-password/:id', auth, async (req, res) => {
    const id = req.params.id; // Identifiant de l'utilisateur à mettre à jour
    const { oldpassword, password } = req.body;

    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await user.findOne({ where: { id } });

      if (!existingUser) {
        const message = `L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant.`;
        return res.status(404).json({ message });
      }

      // Vérifier le mot de passe actuel
      const isPasswordValid = await bcrypt.compare(oldpassword, existingUser.password);
      if (!isPasswordValid) {
        const message = `L'ancien mot de passe est incorrect.`;
        return res.status(401).json({ message });
      }

      // Hachage du nouveau mot de passe
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mise à jour du mot de passe dans la base de données
        await user.update({ password: hashedPassword }, { where: { id } });

        const message = `Le mot de passe de l'utilisateur ${id} a été mis à jour avec succès.`;
        return res.json({ message });
      } else {
        const message = `Aucun mot de passe fourni pour la mise à jour.`;
        return res.status(400).json({ message });
      }
    } catch (error) {
      if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: error.message });
      }

      const message = `Une erreur est survenue lors de la mise à jour du mot de passe.`;
      res.status(500).json({ message, data: error.message });
    }
  });
};
