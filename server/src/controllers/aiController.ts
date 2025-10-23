import { Request, Response } from 'express';
import { aiService } from '../services/aiService';

export class AIController {
  /**
   * Send message to AI assistant
   */
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;
      const userId = req.user?.id;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Message is required',
        });
        return;
      }

      if (message.length > 1000) {
        res.status(400).json({
          success: false,
          error: 'Message is too long (max 1000 characters)',
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const response = await aiService.sendMessage(userId, message.trim());

      res.json({
        success: true,
        data: {
          response,
        },
        message: 'AI response received successfully',
      });
    } catch (error: any) {
      console.error('Error in AI Controller:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get AI response',
      });
    }
  }
}


