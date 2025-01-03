const { user } = require('../../dataBase/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const multer = require('multer');
const auth = require('../../authentification/auth');

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (app) => {
    app.put('/api/update-user-picture/:id', auth, upload.single('picture'), async (req, res) => {
        const id = req.params.id;
        const { file, body } = req;
        const { ...otherDetails } = body;

        try {
            if (!file) {
                return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
            }
            if (!file.mimetype.startsWith('image/')) {
                return res.status(400).json({ message: 'Le fichier doit être une image.' });
            }
            if (file.size > MAX_FILE_SIZE) {
                return res.status(400).json({ message: 'Le fichier est trop volumineux.' });
            }

            const userExists = await user.findOne({ where: { id } });
            if (!userExists) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }

            const buf = file.buffer;

            const [updated] = await user.update(
                { ...otherDetails, picture: buf },
                { where: { id } }
            );

            if (updated) {
                const message = `L'image a bien été mise à jour.`;
                return res.status(200).json({ message });
            } else {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error.errors });
            }
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: 'Cette image existe déjà.', data: error.errors });
            }
            console.error(error); // Log unexpected errors
            return res.status(500).json({
                message: 'Une erreur est survenue lors de la mise à jour de l\'image.',
                data: error,
            });
        }
    });
};
