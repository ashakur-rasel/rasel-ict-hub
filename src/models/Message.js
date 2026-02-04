import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
      senderId: { type: String, required: true }, // Teacher ba Student-er ID
      receiverId: { type: String, required: true }, // Jar kache jabe
      senderName: { type: String },
      text: { type: String },
      attachment: { type: String }, // Drive link ba file URL
      timestamp: { type: Date, default: Date.now },
      isRead: { type: Boolean, default: false }
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);