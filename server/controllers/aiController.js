import { Ticket } from '../models/Ticket.js';
import { AIInsight } from '../models/AIInsight.js';
import { isDbConnected } from '../config/db.js';
import { mockData } from '../services/mockDataStore.js';
import {
  analyzeTicketWithGemini,
  generateResponseWithGemini,
  chatWithAIAssistant,
} from '../services/geminiService.js';

// @desc    Analyze a ticket with Gemini AI
// @route   POST /api/ai/analyze-ticket
// @access  Private (Agents, Admins, Customers)
export const analyzeTicket = async (req, res, next) => {
  try {
    const { ticketId, subject, description, conversationHistory = [] } = req.body;

    let targetSubject = subject;
    let targetDescription = description;
    let targetCustomerName = 'Customer';
    let dbTicket = null;

    if (ticketId) {
      if (isDbConnected()) {
        dbTicket = await Ticket.findById(ticketId).populate('customer', 'name');
        if (dbTicket) {
          targetSubject = dbTicket.subject;
          targetDescription = dbTicket.description;
          targetCustomerName = dbTicket.customer?.name || 'Customer';
        }
      } else {
        const found = mockData.tickets.find(
          (t) => t._id.toString() === ticketId || t.ticketNumber === ticketId
        );
        if (found) {
          targetSubject = found.subject;
          targetDescription = found.description;
          const cust = mockData.users.find((u) => u._id.toString() === found.customer?.toString());
          targetCustomerName = cust?.name || 'Customer';
        }
      }
    }

    if (!targetSubject && !targetDescription) {
      return res.status(400).json({
        success: false,
        message: 'Ticket subject or description is required for analysis',
      });
    }

    // Call Gemini API
    const analysis = await analyzeTicketWithGemini({
      subject: targetSubject,
      description: targetDescription,
      conversationHistory,
      customerName: targetCustomerName,
    });

    // Save insight in database if ticketId provided
    if (ticketId) {
      if (isDbConnected() && dbTicket) {
        await Ticket.findByIdAndUpdate(ticketId, {
          category: analysis.category || dbTicket.category,
          priority: analysis.priority || dbTicket.priority,
          sentiment: analysis.sentiment || 'Neutral',
          urgency: analysis.urgency || 'Medium',
          aiSummary: analysis.summary,
          aiSuggestedResponse: analysis.suggestedResponse,
        });

        await AIInsight.create({
          ticketId: dbTicket._id,
          category: analysis.category,
          priority: analysis.priority,
          sentiment: analysis.sentiment,
          urgency: analysis.urgency,
          summary: analysis.summary,
          suggestedResponse: analysis.suggestedResponse,
          actionItems: analysis.actionItems || [],
          confidenceScore: analysis.confidenceScore || 0.95,
        });
      } else {
        const ticketIdx = mockData.tickets.findIndex(
          (t) => t._id.toString() === ticketId || t.ticketNumber === ticketId
        );
        if (ticketIdx !== -1) {
          mockData.tickets[ticketIdx] = {
            ...mockData.tickets[ticketIdx],
            category: analysis.category || mockData.tickets[ticketIdx].category,
            priority: analysis.priority || mockData.tickets[ticketIdx].priority,
            sentiment: analysis.sentiment || 'Neutral',
            urgency: analysis.urgency || 'Medium',
            aiSummary: analysis.summary,
            aiSuggestedResponse: analysis.suggestedResponse,
          };
        }
      }
    }

    return res.json({
      success: true,
      data: analysis,
      message: 'AI analysis completed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate tailored support response with Gemini AI
// @route   POST /api/ai/generate-response
// @access  Private (Agents, Admins)
export const generateResponse = async (req, res, next) => {
  try {
    const {
      subject,
      description,
      conversationHistory = [],
      customerName = 'Customer',
      tone = 'empathetic',
      category = 'Technical',
      priority = 'Medium',
    } = req.body;

    const agentName = req.user?.name || 'Support Specialist';

    const result = await generateResponseWithGemini({
      subject,
      description,
      conversationHistory,
      customerName,
      agentName,
      tone,
      category,
      priority,
    });

    return res.json({
      success: true,
      data: result,
      message: 'Response generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Copilot Chat
// @route   POST /api/ai/chat
// @access  Private
export const chatAssistant = async (req, res, next) => {
  try {
    const { message, history = [], contextSummary = '' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const result = await chatWithAIAssistant({
      message,
      history,
      contextSummary,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI service status and diagnostics
// @route   GET /api/ai/status
// @access  Private
export const getAiStatus = async (req, res, next) => {
  try {
    const { testGeminiConnection } = await import('../services/geminiService.js');
    const status = await testGeminiConnection();
    return res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

