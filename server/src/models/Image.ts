import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  name: string;
  filename: string;
  originalName: string;
  category: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  description?: string;
  alt?: string;
  isActive: boolean;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
      // Removed unique: true to allow same file in multiple categories
    },
    originalName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'defaults',
        'header',
        'logo',
        'hero',
        'backgrounds',
        'empowerment',
        'programs',
        'projects',
        'events',
        'campaigns',
        'other'
      ],
    },
    key: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Changed from unique to non-unique to allow multiple images with same category-key (e.g., hero carousel)
ImageSchema.index({ category: 1, key: 1 }); // Non-unique index for category-key lookups
ImageSchema.index({ filename: 1 }); // Non-unique index for filename lookups
ImageSchema.index({ isActive: 1 });

export default mongoose.model<IImage>('Image', ImageSchema);
