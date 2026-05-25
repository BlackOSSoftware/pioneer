import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: "main", unique: true },
    about: { type: mongoose.Schema.Types.Mixed, default: {} },
    products: { type: mongoose.Schema.Types.Mixed, default: {} },
    services: { type: mongoose.Schema.Types.Mixed, default: {} },
    insurance: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const SiteContent =
  mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);

export default SiteContent;
