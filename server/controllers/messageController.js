import { Message } from '../models/Message.js';
import { Ticket } from '../models/Ticket.js';
import { isDbConnected } from '../config/db.js';
import { mockData } from '../services/mockDataStore.js';

const populateMockUser = (userId) => {
  if (!userId) return null;
  const user = mockData.users.find((u) => u._id.toString() === userId.toString());
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

// @desc    Get all messages for a ticket
// @route   GET /api/tickets/:id/messages
// @access  Private
export const getMessagesByTicketId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const messages = await Message.find({ ticketId: id })
        .populate('sender', 'name email role avatar company')
        .sort('createdAt');

      return res.json({
        success: true,
        data: messages,
      });
    } else {
      const ticket = mockData.tickets.find(
        (t) => t._id.toString() === id || t.ticketNumber === id
      );
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
      }

      const messages = mockData.messages
        .filter((m) => m.ticketId.toString() === ticket._id.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((m) => ({
          ...m,
          sender: populateMockUser(m.sender),
        }));

      return res.json({
        success: true,
        data: messages,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message or internal note on a ticket
// @route   POST /api/tickets/:id/messages
// @access  Private
export const createMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, isInternalNote = false, attachments = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot be empty',
      });
    }

    const senderId = req.user._id;

    if (isDbConnected()) {
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
      }

      const newMessage = await Message.create({
        ticketId: ticket._id,
        sender: senderId,
        message: message.trim(),
        isInternalNote,
        attachments,
      });

      // Update ticket status to In Progress if Agent responded to Open ticket
      if (req.user.role !== 'customer' && ticket.status === 'Open') {
        ticket.status = 'In Progress';
      }
      ticket.updatedAt = new Date();
      await ticket.save();

      const populatedMessage = await Message.findById(newMessage._id).populate(
        'sender',
        'name email role avatar company'
      );

      return res.status(201).json({
        success: true,
        data: populatedMessage,
      });
    } else {
      const ticket = mockData.tickets.find(
        (t) => t._id.toString() === id || t.ticketNumber === id
      );
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found',
        });
      }

      const newMessage = {
        _id: 'msg_' + Date.now(),
        ticketId: ticket._id.toString(),
        sender: senderId.toString(),
        message: message.trim(),
        isInternalNote,
        attachments,
        createdAt: new Date(),
      };

      mockData.messages.push(newMessage);

      if (req.user.role !== 'customer' && ticket.status === 'Open') {
        ticket.status = 'In Progress';
      }
      ticket.updatedAt = new Date();

      const responseMessage = {
        ...newMessage,
        sender: populateMockUser(senderId),
      };

      return res.status(201).json({
        success: true,
        data: responseMessage,
      });
    }
  } catch (error) {
    next(error);
  }
};
