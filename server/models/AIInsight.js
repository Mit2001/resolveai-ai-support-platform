import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    suggestedResponse: {
      type: String,
      required: true,
    },
    actionItems: [
      {
        type: String,
      },
    ],
    confidenceScore: {
      type: Number,
      default: 0.95,
    },
  },
  {
    timestamps: true,
  }
);

export const AIInsight = mongoose.model('AIInsight', aiInsightSchema);
