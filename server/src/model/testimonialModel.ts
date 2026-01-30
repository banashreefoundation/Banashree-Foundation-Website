import { Schema, model, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
    name: string;
    designation: string;
    message: string;
    image?: string;
    status: 'pending' | 'approved' | 'rejected';
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    order?: number;
}

export interface ITestimonialMethods {
    approve(): Promise<void>;
    reject(): Promise<void>;
    publish(): Promise<void>;
    unpublish(): Promise<void>;
}

interface TestimonialModel extends Model<ITestimonial, {}, ITestimonialMethods> {
    findPublished(): Promise<ITestimonial[]>;
    findByStatus(status: ITestimonial['status']): Promise<ITestimonial[]>;
}

const testimonialSchema = new Schema<ITestimonial, TestimonialModel, ITestimonialMethods>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [100, 'Name cannot exceed 100 characters']
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true,
            maxlength: [150, 'Designation cannot exceed 150 characters']
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters long'],
            maxlength: [1000, 'Message cannot exceed 1000 characters']
        },
        image: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date
        },
        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Instance methods
testimonialSchema.methods.approve = async function(): Promise<void> {
    this.status = 'approved';
    await this.save();
};

testimonialSchema.methods.reject = async function(): Promise<void> {
    this.status = 'rejected';
    this.isPublished = false;
    await this.save();
};

testimonialSchema.methods.publish = async function(): Promise<void> {
    if (this.status !== 'approved') {
        throw new Error('Only approved testimonials can be published');
    }
    this.isPublished = true;
    this.publishedAt = new Date();
    await this.save();
};

testimonialSchema.methods.unpublish = async function(): Promise<void> {
    this.isPublished = false;
    await this.save();
};

// Static methods
testimonialSchema.statics.findPublished = function(): Promise<ITestimonial[]> {
    return this.find({ isPublished: true, status: 'approved' })
        .sort({ order: -1, publishedAt: -1 })
        .exec();
};

testimonialSchema.statics.findByStatus = function(status: ITestimonial['status']): Promise<ITestimonial[]> {
    return this.find({ status }).sort({ createdAt: -1 }).exec();
};

// Indexes for better query performance
testimonialSchema.index({ status: 1, isPublished: 1 });
testimonialSchema.index({ createdAt: -1 });

const Testimonial = model<ITestimonial, TestimonialModel>('Testimonial', testimonialSchema);

export default Testimonial;
