import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { mockData } from '../services/mockDataStore.js';
import { analyzeTicketWithGemini } from '../services/geminiService.js';

// Helper to populate user in mock mode
const populateMockUser = (userId) => {
  if (!userId) return null;
  const user = mockData.users.find((u) => u._id.toString() === userId.toString());
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { subject, description, category = 'Technical', priority = 'Medium', autoAnalyze = true } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Subject and description are required',
      });
    }

    const customerId = req.user._id;
    const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    // Optional quick AI pre-classification
    let aiSummary = '';
    let aiSuggestedResponse = '';
    let detectedSentiment = 'Neutral';
    let urgency = 'Medium';

    if (autoAnalyze) {
      try {
        const aiResult = await analyzeTicketWithGemini({
          subject,
          description,
          customerName: req.user.name,
        });
        aiSummary = aiResult.summary || '';
        aiSuggestedResponse = aiResult.suggestedResponse || '';
        detectedSentiment = aiResult.sentiment || 'Neutral';
        urgency = aiResult.urgency || 'Medium';
      } catch (err) {
        console.warn('[AI Pre-analysis Skipped]', err.message);
      }
    }

    if (isDbConnected()) {
      const ticket = await Ticket.create({
        ticketNumber,
        customer: customerId,
        subject,
        description,
        category,
        priority,
        status: 'Open',
        sentiment: detectedSentiment,
        urgency,
        aiSummary,
        aiSuggestedResponse,
        slaDueAt: new Date(Date.now() + 24 * 3600 * 1000),
      });

      const populatedTicket = await Ticket.findById(ticket._id)
        .populate('customer', 'name email company avatar')
        .populate('assignedAgent', 'name email avatar');

      return res.status(201).json({
        success: true,
        data: populatedTicket,
        message: 'Ticket created successfully',
      });
    } else {
      const newTicket = {
        _id: 'tck_' + Date.now(),
        ticketNumber,
        customer: customerId.toString(),
        assignedAgent: null,
        subject,
        description,
        category,
        priority,
        status: 'Open',
        sentiment: detectedSentiment,
        urgency,
        aiSummary,
        aiSuggestedResponse,
        tags: [category.toLowerCase()],
        slaDueAt: new Date(Date.now() + 24 * 3600 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockData.tickets.unshift(newTicket);

      const responseTicket = {
        ...newTicket,
        customer: populateMockUser(newTicket.customer),
        assignedAgent: null,
      };

      return res.status(201).json({
        success: true,
        data: responseTicket,
        message: 'Ticket created successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets with filters, search, pagination
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      assignedTo,
      sort = '-createdAt',
      page = 1,
      limit = 20,
    } = req.query;

    if (isDbConnected()) {
      let query = {};

      // Role isolation: customers can only see their own tickets
      if (req.user.role === 'customer') {
        query.customer = req.user._id;
      }

      if (status && status !== 'All') {
        query.status = status;
      }

      if (priority && priority !== 'All') {
        query.priority = priority;
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (assignedTo) {
        query.assignedAgent = assignedTo === 'unassigned' ? null : assignedTo;
      }

      if (search) {
        query.$or = [
          { ticketNumber: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const count = await Ticket.countDocuments(query);
      const tickets = await Ticket.find(query)
        .populate('customer', 'name email company avatar')
        .populate('assignedAgent', 'name email avatar')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return res.json({
        success: true,
        data: tickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    } else {
      // Memory Store logic
      let filtered = [...mockData.tickets];

      if (req.user.role === 'customer') {
        filtered = filtered.filter(
          (t) => t.customer.toString() === req.user._id.toString()
        );
      }

      if (status && status !== 'All') {
        filtered = filtered.filter((t) => t.status === status);
      }

      if (priority && priority !== 'All') {
        filtered = filtered.filter((t) => t.priority === priority);
      }

      if (category && category !== 'All') {
        filtered = filtered.filter((t) => t.category === category);
      }

      if (assignedTo) {
        if (assignedTo === 'unassigned') {
          filtered = filtered.filter((t) => !t.assignedAgent);
        } else {
          filtered = filtered.filter((t) => t.assignedAgent?.toString() === assignedTo);
        }
      }

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.ticketNumber.toLowerCase().includes(s) ||
            t.subject.toLowerCase().includes(s) ||
            t.description.toLowerCase().includes(s)
        );
      }

      // Sort
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * limit, page * limit).map((t) => ({
        ...t,
        customer: populateMockUser(t.customer),
        assignedAgent: populateMockUser(t.assignedAgent),
      }));

      return res.json({
        success: true,
        data: paginated,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const ticket = await Ticket.findById(id)
        .populate('customer', 'name email company avatar status createdAt')
        .populate('assignedAgent', 'name email avatar status');

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: `Ticket not found with ID ${id}`,
        });
      }

      if (
        req.user.role === 'customer' &&
        ticket.customer._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this ticket',
        });
      }

      return res.json({
        success: true,
        data: ticket,
      });
    } else {
      const ticket = mockData.tickets.find(
        (t) => t._id.toString() === id || t.ticketNumber === id
      );

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: `Ticket not found with ID ${id}`,
        });
      }

      if (
        req.user.role === 'customer' &&
        ticket.customer.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this ticket',
        });
      }

      const populatedTicket = {
        ...ticket,
        customer: populateMockUser(ticket.customer),
        assignedAgent: populateMockUser(ticket.assignedAgent),
      };

      return res.json({
        success: true,
        data: populatedTicket,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket
// @route   PATCH /api/tickets/:id
// @access  Private (Agents & Admins, or Customer status close)
export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      status,
      priority,
      category,
      assignedAgent,
      sentiment,
      urgency,
      aiSummary,
      aiSuggestedResponse,
    } = req.body;

    const updates = {};
    if (status !== undefined) {
      updates.status = status;
      if (status === 'Resolved' || status === 'Closed') {
        updates.resolvedAt = new Date();
      }
    }
    if (priority !== undefined) updates.priority = priority;
    if (category !== undefined) updates.category = category;
    if (assignedAgent !== undefined) updates.assignedAgent = assignedAgent;
    if (sentiment !== undefined) updates.sentiment = sentiment;
    if (urgency !== undefined) updates.urgency = urgency;
    if (aiSummary !== undefined) updates.aiSummary = aiSummary;
    if (aiSuggestedResponse !== undefined) updates.aiSuggestedResponse = aiSuggestedResponse;
    updates.updatedAt = new Date();

    if (isDbConnected()) {
      const ticket = await Ticket.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      })
        .populate('customer', 'name email company avatar')
        .populate('assignedAgent', 'name email avatar');

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
      }

      return res.json({
        success: true,
        data: ticket,
        message: 'Ticket updated successfully',
      });
    } else {
      const index = mockData.tickets.findIndex(
        (t) => t._id.toString() === id || t.ticketNumber === id
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
      }

      mockData.tickets[index] = {
        ...mockData.tickets[index],
        ...updates,
      };

      const updated = {
        ...mockData.tickets[index],
        customer: populateMockUser(mockData.tickets[index].customer),
        assignedAgent: populateMockUser(mockData.tickets[index].assignedAgent),
      };

      return res.json({
        success: true,
        data: updated,
        message: 'Ticket updated successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin only)
export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const ticket = await Ticket.findByIdAndDelete(id);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
      }
    } else {
      const index = mockData.tickets.findIndex(
        (t) => t._id.toString() === id || t.ticketNumber === id
      );
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
      }
      mockData.tickets.splice(index, 1);
    }

    return res.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
