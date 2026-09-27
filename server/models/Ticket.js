import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Technical', 'Billing', 'Account', 'Payment', 'Bug', 'Feature Request', 'Other'],
      default: 'Technical',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
      default: 'Open',
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Frustrated', 'Angry', 'Urgent', 'Confused'],
      default: 'Neutral',
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Immediate'],
      default: 'Medium',
    },
    aiSummary: {
      type: String,
      default: '',
    },
    aiSuggestedResponse: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],
    slaDueAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // default 24h SLA
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
