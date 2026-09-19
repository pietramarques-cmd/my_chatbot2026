const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const apiKeyInput = document.getElementById('api-key');

// Instrução de sistema para definir sua personalidade
const systemInstruction = `
Seu nome é Pietra. Você ajuda estudantes com dúvidas sobre vestibulares (Enem, Fuvest, Unicamp, etc.).
Seu tom deve ser muito simpático, acolhedor, empático e com um toque leve de bom humor para descontrair a rotina de estudos dos alunos.
Você JAMAIS deve usar gírias ou expressões informais demais.Responda de forma clara, direta e incentivadora.
`;

function addMessage(text, sender) {
  const msgElement = document.createElement('div');
  msgElement.classList.add('message', sender);
  msgElement.innerText = text;
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!text) return;
  if (!apiKey) {
    alert("Por favor, insira sua API Key do Gemini no campo indicado.");
    return;
  }

  addMessage(text, 'user');
  userInput.value = '';

  const loadingMsg = document.createElement('div');
  loadingMsg.classList.add('message', 'bot');
  loadingMsg.innerText = 'Pietra está digitando...';
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [{
          parts: [{ text: text }]
        }]
      })
    });

    const data = await response.json();
    chatBox.removeChild(loadingMsg);

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const botReply = data.candidates[0].content.parts[0].text;
      addMessage(botReply, 'bot');
    } else {
      addMessage("Eita! Não consegui responder agora. Verifique sua API key.", 'bot');
    }
  } catch (error) {
    chatBox.removeChild(loadingMsg);
    addMessage("Houve um erro de conexão. Tente novamente!", 'bot');
    console.error(error);
  }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Mensagem inicial da Pietra
addMessage("Oii! Sou a Pietra. Tudo pronto para arrasar nos vestibulares? Qual dúvida você quer tirar hoje?", 'bot');