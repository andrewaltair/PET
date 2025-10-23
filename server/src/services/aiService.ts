import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️  GEMINI_API_KEY not set. AI features will be disabled.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const aiService = {
  /**
   * Send a message to the AI assistant
   */
  async sendMessage(userId: string, message: string): Promise<string> {
    if (!genAI) {
      throw new Error('AI service is not configured. Please set GEMINI_API_KEY in environment variables.');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are a helpful assistant for a pet service marketplace. 
      Help users with questions about pet care, services, bookings, and general pet-related inquiries.
      Be friendly, concise, and helpful.
      
      User question: ${message}
      
      Please provide a helpful response:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get AI response. Please try again later.');
    }
  },
};

