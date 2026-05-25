import mongoose from "mongoose";

const VisitingCardShareSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    advisorName: { type: String, required: true, trim: true },
    advisorPhone: { type: String, required: true, trim: true },
    advisorEmail: { type: String, trim: true, default: "" },
    companyName: { type: String, default: "Pioneer Wealth", trim: true },
    subtitle: { type: String, default: "Financial Planning & Mutual Funds", trim: true },
    companyPhone: { type: String, default: "+91 98765 43210", trim: true },
    role: { type: String, default: "Wealth Advisor", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const VisitingCardShare =
  mongoose.models.VisitingCardShare || mongoose.model("VisitingCardShare", VisitingCardShareSchema);

export default VisitingCardShare;
