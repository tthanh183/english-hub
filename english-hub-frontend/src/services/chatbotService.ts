import axios from 'axios';

export async function sendChatMessage(message: string) {
  try {
    const res = await axios.post('http://localhost:5000/ask', {
      prompt: message,
    });

    return res.data.response || "I'm sorry, I couldn't get a response.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm sorry, I encountered an error. Please try again later.";
  }
}
