const { user } = require('../../dataBase/sequelize');
const {Op} = require('sequelize')
const auth = require('../../authentification/auth')
module.exports = (app) => {
    app.get('/api/get-user/:field/:value',auth, (req, res) => {
        const value = req.params.value
        const field = req.params.field

        return user.findOne({
            where:{
                [field]: {
                    [Op.like]: `%${value}%`
                }
            }
        }) 
        .then(user => {
            if (user === null) {
                const message = `L'user demandé n'est pas disponible.`;
                return res.status(404).json({ message });
            }
            const message = `Un user a bien été trouvé.`;
            res.json({ message, data: user });
        })
        .catch(error => {
            const message = `L'user n'a pas pu être récupéré. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
    })
}