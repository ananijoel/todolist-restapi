const { user } = require('../../dataBase/sequelize');
const { ValidationError, UniqueConstraintError, where } = require('sequelize');
const auth = require('../../authentification/auth')
module.exports = (app) => {
    app.delete('/api/remove-user-picture/:username',auth, (req, res) => {
        user.findOne({ where: { username: req.params.username } })
            .then(user => {
                if (user === null) {
                    const message = `L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant.`;
                    return res.status(404).json({ message });
                }

                // Assuming 'picture' is a field in the user model
                user.picture = null;
                
                return user.save()
                    .then(_ => {
                        const message = `La photo de profil de l'utilisateur ${user.username} a bien été supprimée.`;
                        res.json({ message });
                    });
            })
            .catch(error => {
                const message = `La photo de profil de l'utilisateur n'a pas pu être supprimée. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
    });
};
