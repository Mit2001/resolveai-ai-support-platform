import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Ticket } from '../models/Ticket.js';
import { isDbConnected } from '../config/db.js';
import { mockData } from '../services/mockDataStore.js';

// @desc    Get all team members with stats
// @route   GET /api/team
// @access  Private (Agents & Admins)
export const getTeam = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const team = await User.find({ role: { $in: ['agent', 'admin'] } }).select('-password');
      const tickets = await Ticket.find({});

      const teamWithStats = team.map((member) => {
        const assignedTickets = tickets.filter(
          (t) => t.assignedAgent?.toString() === member._id.toString()
        ).length;
        const resolvedTickets = tickets.filter(
          (t) =>
            t.assignedAgent?.toString() === member._id.toString() &&
            (t.status === 'Resolved' || t.status === 'Closed')
        ).length;

        return {
          _id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          avatar: member.avatar,
          company: member.company,
          status: member.status || 'active',
          assignedTickets,
          resolvedTickets,
          createdAt: member.createdAt,
        };
      });

      return res.json({
        success: true,
        data: teamWithStats,
      });
    } else {
      const team = mockData.users.filter((u) => u.role === 'agent' || u.role === 'admin');

      const teamWithStats = team.map((member) => {
        const assignedTickets = mockData.tickets.filter(
          (t) => t.assignedAgent?.toString() === member._id.toString()
        ).length;
        const resolvedTickets = mockData.tickets.filter(
          (t) =>
            t.assignedAgent?.toString() === member._id.toString() &&
            (t.status === 'Resolved' || t.status === 'Closed')
        ).length;

        const { password, ...safeMember } = member;
        return {
          ...safeMember,
          assignedTickets: assignedTickets || 4,
          resolvedTickets: resolvedTickets || 3,
        };
      });

      return res.json({
        success: true,
        data: teamWithStats,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add new team member
// @route   POST /api/team
// @access  Private (Admin only)
export const addTeamMember = async (req, res, next) => {
  try {
    const { name, email, password = 'password123', role = 'agent' } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    if (isDbConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        status: 'active',
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
          assignedTickets: 0,
          resolvedTickets: 0,
        },
        message: 'Team member added successfully',
      });
    } else {
      const existing = mockData.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newMember = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        status: 'active',
        company: 'ResolveAI Support Squad',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        assignedTickets: 0,
        resolvedTickets: 0,
        createdAt: new Date(),
      };

      mockData.users.push(newMember);

      const { password: _, ...safeMember } = newMember;
      return res.status(201).json({
        success: true,
        data: safeMember,
        message: 'Team member added successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PATCH /api/team/:id
// @access  Private (Admin only)
export const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, status, name } = req.body;

    const updates = {};
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (name) updates.name = name;

    if (isDbConnected()) {
      const updated = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      return res.json({ success: true, data: updated, message: 'Team member updated' });
    } else {
      const idx = mockData.users.findIndex((u) => u._id.toString() === id.toString());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Team member not found' });
      }
      mockData.users[idx] = { ...mockData.users[idx], ...updates };
      const { password, ...safeUser } = mockData.users[idx];
      return res.json({ success: true, data: safeUser, message: 'Team member updated' });
    }
  } catch (error) {
    next(error);
  }
};
