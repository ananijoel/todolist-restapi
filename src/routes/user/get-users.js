const { user } = require('../../dataBase/sequelize')
const auth = require('../../authentification/auth')
module.exports = (app) => {
    app.get('/api/get-users',auth, (req, res) => {

        return user.findAll()
        .then(user => {
            if (user === null) {
                const message = `L'user demandé n'est pas disponible.`;
                return res.status(404).json({ message });
            }
            const message = `des users ont bien été trouvés.`;
            //res.json({ message, data: user });
            const filteredItems = user.map(user_mapper => ({
                ...user_mapper.dataValues, // Use dataValues to get the actual data
                picture: user_mapper.picture !== null,
                
              }));
              res.json({ message, data: filteredItems });
        })
        .catch(error => {
            const message = `L'user n'a pas pu être récupéré. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
    })
}