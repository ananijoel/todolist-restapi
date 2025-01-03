const { user } = require('../../dataBase/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.post('/api/add-user', async (req, res) => {
        const { password, ...otherDetails } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const add_user = await user.create({ ...otherDetails, password: hashedPassword });

            const message = `L'utilisateur ${req.body.username} a bien été créé`;
            res.json({ message, data: add_user });
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `L'utilisateur n'a pas pu être ajouté. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    });
}
