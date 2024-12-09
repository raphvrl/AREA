"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("./UserController");
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const axios_1 = __importDefault(require("axios"));
require("./linkedinAuth");
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
const PORT = 5000;
(0, db_1.default)();
// Middleware Passport
app.use(passport_1.default.initialize());
// Route de démarrage de l'authentification LinkedIn
app.get('/api/auth/linkedin', passport_1.default.authenticate('linkedin'));
// Route de callback après authentification LinkedIn
app.get('/api/auth/linkedin/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationCode = req.query.code;
        if (!authorizationCode) {
            res.status(400).json({ error: 'Authorization code is missing from the callback URL' });
            return;
        }
        const response = yield axios_1.default.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: process.env.LINKEDIN_CALLBACK_URL || 'https://localhost:5000/api/auth/linkedin/callback',
                client_id: process.env.LINKEDIN_CLIENT_ID || 'your-client-id',
                client_secret: process.env.LINKEDIN_CLIENT_SECRET || 'your-client-secret',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const accessToken = response.data.access_token;
        if (!accessToken) {
            throw new Error('Failed to retrieve access token');
        }
        const profileResponse = yield axios_1.default.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const userData = profileResponse.data;
        // Logique d'insertion ou de mise à jour dans la base de données
        let isFirstLogin = false;
        const existingUser = yield (0, UserController_1.getUserByEmail)(userData.email);
        if (existingUser) {
            console.log(`User already exists: ${existingUser.email}`);
        }
        else {
            yield (0, UserController_1.createUser)({
                firstName: userData.given_name,
                lastName: userData.family_name,
                email: userData.email,
                apiKeys: {}, // Ajoutez les API keys si nécessaire
            });
            isFirstLogin = true;
            console.log(`New user created: ${userData.email}`);
        }
        // Envoyez une réponse au client
        res.redirect(`http://localhost:3000/login?firstName=${userData.given_name}&lastName=${userData.family_name}&isFirstLogin=${isFirstLogin}`);
    }
    catch (error) {
        res.redirect('/login?error=LinkedIn%20authentication%20failed');
    }
}));
// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
});
// Lecture des certificats SSL/TLS
const privateKey = fs_1.default.readFileSync('./ssl/server.key', 'utf8');
const certificate = fs_1.default.readFileSync('./ssl/server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };
// Créer le serveur HTTPS
https_1.default.createServer(credentials, app).listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});
