import mongoose from "mongoose";

const VisitingCardLeadSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    userPhone: { type: String, required: true, trim: true },
    companyName: { type: String, default: "Pioneer Wealth", trim: true },
    subtitle: { type: String, default: "Financial Planning & Mutual Funds", trim: true },
    companyPhone: { type: String, default: "+91 98765 43210", trim: true },
    source: { type: String, default: "Visiting Card Page", trim: true },
    /** Public share token when lead came from /card/[token] */
    shareToken: { type: String, trim: true, default: "" },
    /** Advisor name on the visiting card link (for admin context) */
    cardAdvisorName: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export const VisitingCardLead =
  mongoose.models.VisitingCardLead ||
  mongoose.model("VisitingCardLead", VisitingCardLeadSchema);

export default VisitingCardLead;
