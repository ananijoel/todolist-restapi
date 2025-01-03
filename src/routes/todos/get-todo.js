const { Todo } = require('../../dataBase/sequelize');
const auth = require('../../authentification/auth');

module.exports = (app) => {
    app.get('/api/get-todo/:userid', async (req, res) => {
        const userid = req.params.userid; // Utilisation de camelCase et déclaration avec const

        try {
            // Utilisation correcte de where
            const todos = await Todo.findAll({ where: { userid } });

            if (todos.length === 0) {
                // Réponse 404 si aucun todo n'est trouvé
                return res.json([
                    {
                        "id": 9,
                        "userid": userid,
                        "title": "Bienvue sur votre liste de tâches",
                        "completed": false,
                    }
                ]);
            }

            // Réponse avec succès
            res.json(todos);
        } catch (error) {
            // Gestion des erreurs
            const message = `Les todos n'ont pas pu être récupérés. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        }
    });
};
