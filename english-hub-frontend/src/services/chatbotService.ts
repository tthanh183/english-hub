import axios from 'axios';

const FLASK_URL = import.meta.env.VITE_FLASK_URL || 'http://localhost:5000';

export async function sendChatMessage(message: string) {
  try {
    const res = await axios.post(`${FLASK_URL}/ask`, {
      prompt: message,
    });

    return res.data.response || "I'm sorry, I couldn't get a response.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm sorry, I encountered an error. Please try again later.";
  }
}
