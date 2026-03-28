const axios = require('axios');

exports.analyzeFeedback = async (title, description) => {
  try {
    console.log("Gemini API Key exists:", !!process.env.GEMINI_API_KEY);

    const prompt = `
Analyse this product feedback and return ONLY valid JSON.

Return format:
{
  "category": "",
  "sentiment": "",
  "priority_score": 1,
  "summary": "",
  "tags": []
}

Feedback:
Title: ${title}
Description: ${description}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    // Clean Gemini response
    let cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      console.error('JSON parse failed:', cleanedText);
      return null;
    }

    return parsed;

  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    return null;
  }
};