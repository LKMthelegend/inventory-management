const jwt = require('jsonwebtoken');

//Middleware pour verifier l'authentification et les rôles des utilisateurs
function authenticate(role) {
    return (req, res, next) => {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const userRole = decoded.role;

            if (role && role !== userRole) {
                return res.status(403).json({ message: 'Accès refusé. Rôle non autorisé.'});
            }
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Accès non autorisé. Token invalide'});
        }
    };
}

module.exports = authenticate;