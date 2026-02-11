import mongoose from "mongoose";

const GlobalConfigSchema = new mongoose.Schema({
      liveLink: { type: String, default: "" },
      isLive: { type: Boolean, default: false },
      globalNotice: { type: String, default: "" },
      history: [{
            type: { type: String }, // 'live', 'terminate', or 'notice'
            content: String,
            date: { type: Date, default: Date.now }
      }]
}, { timestamps: true });

export default mongoose.models.GlobalConfig || mongoose.model("GlobalConfig", GlobalConfigSchema);