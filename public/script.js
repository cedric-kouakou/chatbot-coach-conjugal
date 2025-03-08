document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    // Ajouter le message de l'utilisateur dans la zone de chat
    const chatBox = document.getElementById('chat-box');
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);

    // Effacer l'entrée de l'utilisateur
    document.getElementById('user-input').value = '';

    // Envoyer la question au backend
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: userInput }),
        });

        const data = await response.json();
        const botMessage = document.createElement('div');
        botMessage.classList.add('bot-message');
        botMessage.textContent = data.answer; // Réponse du backend
        chatBox.appendChild(botMessage);
    } catch (error) {
        console.error('Erreur:', error);
        const botMessage = document.createElement('div');
        botMessage.classList.add('bot-message');
        botMessage.textContent = "Désolé, une erreur s'est produite. Réessayez plus tard.";
        chatBox.appendChild(botMessage);
    }

    // Faire défiler la zone de chat vers le bas
    chatBox.scrollTop = chatBox.scrollHeight;
});