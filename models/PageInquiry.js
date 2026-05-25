import mongoose from "mongoose";

/** Leads from Product / Services / Insurance enquiry modals (separate from calculator leads). */
const PageInquirySchema = new mongoose.Schema(
  {
    source: { type: String, required: true }, // product | service | insurance
    context: { type: mongoose.Schema.Types.Mixed, default: {} },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const PageInquiry =
  mongoose.models.PageInquiry || mongoose.model("PageInquiry", PageInquirySchema);

export default PageInquiry;
