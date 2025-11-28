const axios = require("axios");

exports.scanReceipt = async (imageBase64) => {
  try {
    const prompt = `Analyze this receipt image and extract the following information in JSON format:
{
  "amount": <total amount as number>,
  "description": <brief description of purchase>,
  "category": <one of: Food, Transport, Shopping, Rent, Bills, Entertainment, Health, Education, Other>,
  "date": <date in YYYY-MM-DD format, use today if not visible>
}

Return ONLY the JSON object, no additional text.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error("Failed to scan receipt: " + error.message);
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.generateFinancialInsights = async (monthlyData) => {
  try {
    const { income, expenses, categoryBreakdown } = monthlyData;

    const prompt = `As a financial advisor, analyze this monthly financial data and provide exactly 3 brief insights (max 2 sentences each):

Monthly Income: ₹${income}
Total Expenses: ₹${expenses}
Savings: ₹${income - expenses}

Category-wise Spending:
${categoryBreakdown.map(cat => `- ${cat.category}: ₹${cat.amount} (${cat.percentage}%)`).join('\n')}

Provide exactly 3 insights in this format:
1. [One key observation about spending - max 2 sentences]
2. [One practical suggestion - max 2 sentences]
3. [One action for next month - max 2 sentences]

Be concise, direct, and actionable. No lengthy explanations.`;

    await delay(2000);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response?.status === 429) {
      return "1. Your spending patterns show room for optimization.\n2. Consider tracking expenses more carefully to identify savings opportunities.\n3. Set a specific savings goal for next month to improve financial health.";
    }
    throw new Error("Failed to generate insights: " + error.message);
  }
};
