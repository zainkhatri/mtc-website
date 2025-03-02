// api.js
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const PROMPT_PREFIX = `As a knowledgeable Islamic scholar, provide a clear and accurate answer based on authentic Islamic sources. Include relevant Quran verses and Hadith citations where applicable. Be concise but thorough.

Question: `;

export const getIslamicAnswer = async (question) => {
  // Get the API key using the correct environment variable name
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  console.log('Environment variables:', {
    available: !!process.env.REACT_APP_GOOGLE_API_KEY,
    keys: Object.keys(process.env).filter(key => key.includes('GOOGLE'))
  });
  
  if (!apiKey) {
    throw new Error('API key not found. Please check your environment variables.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: PROMPT_PREFIX + question
          }]
        }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};