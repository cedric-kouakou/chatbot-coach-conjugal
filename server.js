const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;

// Configuration de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
// Mots-clés conjugaux
const conjugalKeywords = [
    'amour', 'couple', 'relation', 'conflit', 'communication', 'mariage',
    'divorce', 'problème', 'dispute', 'famille', 'infidélité', 'confiance',
    'émotion', 'sentiment', 'partenaire', 'mari', 'femme', 'conjoint', 'conjointe', 'copain',
    'copine', 'amant', 'amante', 'fiancé', 'fiancée', 'femme', 'homme', ' partenaire'
    
    

];

// Fonction pour vérifier si la question est conjugale
function isConjugalQuestion(question) {
    const lowerCaseQuestion = question.toLowerCase();
    return conjugalKeywords.some(keyword => lowerCaseQuestion.includes(keyword));
}

// Fonction pour limiter la réponse à 100 mots
function limitWords(text, maxWords) {
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...'; // Ajoute "..." si la réponse est tronquée
    }
    return text;
}

app.use(express.json());
app.use(express.static('public')); // Dossier pour les fichiers frontend

// Route pour gérer les questions
app.post('/ask', async (req, res) => {
    const { question } = req.body;

    // Vérifier si la question est conjugale
    if (!isConjugalQuestion(question)) {
        return res.json({ answer: "Désolé, je ne peux répondre qu'aux questions liées aux relations conjugales. Posez-moi une question sur l'amour, le couple, ou la communication !" });
    }

    try {
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = response.text();
        const limitedText = limitWords(text, 150); // Limite la réponse à 100 mots
        res.json({ answer: limitedText });
    } catch (error) {
        console.error('Erreur avec Gemini:', error);
        res.status(500).json({ error: 'Erreur lors de la génération de la réponse' });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});