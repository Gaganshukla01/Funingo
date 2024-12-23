import mongoose from 'mongoose';

const qrTicketSchema = new mongoose.Schema(
  {
    person_name: String,
    red: {
      type: Number,
      default: 0
    },
    green: {
      type: Number,
      default: 0
    },
    yellow: {
      type: Number,
      default: 0
    },
    golden: {
      type: Number,
      default: 0
    },
    payment_verified: {
      type: Boolean,
      default: true
    },
    short_id: String,
    parent_ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    },
    premium_discount: {
      // 50% | 100%
      type: String
    },
    date: {
      type: Date
    },
    freebies_added: {
      red: Number,
      green: Number,
      yellow: Number,
      golden: Number
    }
  },
  {
    versionKey: false
  }
);

const QRTicket = mongoose.model('QRTicket', qrTicketSchema);

export default QRTicket;
