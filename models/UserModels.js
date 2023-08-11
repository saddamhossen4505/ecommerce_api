import mongoose from "mongoose";

// Create userSchema.
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ["Male", "Female", "undefined"],
      default: "undefined",
    },
    photo: {
      type: String,
      trim: true,
      default: null,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Export Models.
export default mongoose.model("User", userSchema);
