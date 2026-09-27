import { User } from '../models/User.js';
import { Ticket } from '../models/Ticket.js';
import { Message } from '../models/Message.js';
import { isDbConnected } from '../config/db.js';
import { mockData } from '../services/mockDataStore.js';

// @desc    Get all customers with metrics
// @route   GET /api/customers
// @access  Private (Agents & Admins)
export const getCustomers = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const customers = await User.find({ role: 'customer' }).select('-password');
      const tickets = await Ticket.find({});

      const customerData = customers.map((c) => {
        const custTickets = tickets.filter(
          (t) => t.customer?.toString() === c._id.toString()
        );
        const totalTickets = custTickets.length;
        const openTickets = custTickets.filter(
          (t) => t.status === 'Open' || t.status === 'In Progress'
        ).length;
        const resolvedTickets = custTickets.filter(
          (t) => t.status === 'Resolved' || t.status === 'Closed'
        ).length;

        const sortedByActivity = custTickets.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
        const lastActivity = sortedByActivity[0]?.updatedAt || c.createdAt;

        return {
          _id: c._id,
          name: c.name,
          email: c.email,
          company: c.company,
          avatar: c.avatar,
          status: c.status,
          totalTickets,
          openTickets,
          resolvedTickets,
          lastActivity,
          createdAt: c.createdAt,
        };
      });

      return res.json({
        success: true,
        data: customerData,
      });
    } else {
      const customers = mockData.users.filter((u) => u.role === 'customer');
      const customerData = customers.map((c) => {
        const custTickets = mockData.tickets.filter(
          (t) => t.customer?.toString() === c._id.toString()
        );
        const totalTickets = custTickets.length;
        const openTickets = custTickets.filter(
          (t) => t.status === 'Open' || t.status === 'In Progress'
        ).length;
        const resolvedTickets = custTickets.filter(
          (t) => t.status === 'Resolved' || t.status === 'Closed'
        ).length;

        const sorted = [...custTickets].sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
        const lastActivity = sorted[0]?.updatedAt || c.createdAt;

        const { password, ...safeCustomer } = c;
        return {
          ...safeCustomer,
          totalTickets,
          openTickets,
          resolvedTickets,
          lastActivity,
        };
      });

      return res.json({
        success: true,
        data: customerData,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer profile by ID
// @route   GET /api/customers/:id
// @access  Private (Agents & Admins)
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const customer = await User.findById(id).select('-password');
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      const tickets = await Ticket.find({ customer: customer._id })
        .populate('assignedAgent', 'name email avatar')
        .sort('-createdAt');

      const ticketIds = tickets.map((t) => t._id);
      const messages = await Message.find({ ticketId: { $in: ticketIds } })
        .populate('sender', 'name role')
        .sort('-createdAt')
        .limit(10);

      const openTickets = tickets.filter(
        (t) => t.status === 'Open' || t.status === 'In Progress'
      ).length;
      const resolvedTickets = tickets.filter(
        (t) => t.status === 'Resolved' || t.status === 'Closed'
      ).length;

      return res.json({
        success: true,
        data: {
          customer,
          stats: {
            totalTickets: tickets.length,
            openTickets,
            resolvedTickets,
            satisfactionScore: '98%',
            avgResponseTime: '24 mins',
          },
          tickets,
          recentActivity: messages,
        },
      });
    } else {
      const customer = mockData.users.find(
        (u) => u._id.toString() === id.toString() && u.role === 'customer'
      );
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found',
        });
      }

      const tickets = mockData.tickets
        .filter((t) => t.customer.toString() === customer._id.toString())
        .map((t) => {
          const agent = mockData.users.find((u) => u._id.toString() === t.assignedAgent?.toString());
          return {
            ...t,
            assignedAgent: agent ? { _id: agent._id, name: agent.name, email: agent.email, avatar: agent.avatar } : null,
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const { password, ...safeCustomer } = customer;

      return res.json({
        success: true,
        data: {
          customer: safeCustomer,
          stats: {
            totalTickets: tickets.length,
            openTickets: tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length,
            resolvedTickets: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
            satisfactionScore: '98%',
            avgResponseTime: '24 mins',
          },
          tickets,
          recentActivity: [],
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
