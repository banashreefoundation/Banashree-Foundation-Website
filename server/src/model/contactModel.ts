import { Schema, model, Document, Model } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    phone?: string;
    inquiryType: 'general' | 'partnership' | 'volunteer' | 'donation' | 'other';
    subject: string;
    message: string;
    status: 'new' | 'in-progress' | 'resolved' | 'closed';
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    resolvedBy?: Schema.Types.ObjectId;
    notes?: string;
}

export interface IContactMethods {
    markAsResolved(adminId: string, notes?: string): Promise<void>;
    updateStatus(status: IContact['status']): Promise<void>;
}

interface ContactModel extends Model<IContact, {}, IContactMethods> {
    findByEmail(email: string): Promise<IContact[]>;
    findByInquiryType(type: IContact['inquiryType']): Promise<IContact[]>;
    findPendingInquiries(): Promise<IContact[]>;
    getStatsByType(): Promise<Array<{ _id: string; count: number }>>;
}

const contactSchema = new Schema<IContact, ContactModel, IContactMethods>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address'
            ]
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
        },
        inquiryType: {
            type: String,
            required: [true, 'Inquiry type is required'],
            enum: {
                values: ['general', 'partnership', 'volunteer', 'donation', 'other'],
                message: '{VALUE} is not a valid inquiry type'
            }
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            maxlength: [200, 'Subject cannot exceed 200 characters']
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            maxlength: [2000, 'Message cannot exceed 2000 characters']
        },
        status: {
            type: String,
            enum: ['new', 'in-progress', 'resolved', 'closed'],
            default: 'new'
        },
        resolvedAt: {
            type: Date
        },
        resolvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Notes cannot exceed 1000 characters']
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt
    }
);

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ inquiryType: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

// Instance Methods
contactSchema.methods.markAsResolved = async function (adminId: any, notes?: string) {
    this.status = 'resolved';
    this.resolvedAt = new Date();
    this.resolvedBy = adminId;
    if (notes) {
        this.notes = notes;
    }
    await this.save();
};

contactSchema.methods.updateStatus = async function (status: IContact['status']) {
    this.status = status;
    await this.save();
};

// Static Methods
contactSchema.statics.findByEmail = async function (email: string) {
    return await this.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
};

contactSchema.statics.findByInquiryType = async function (type: IContact['inquiryType']) {
    return await this.find({ inquiryType: type }).sort({ createdAt: -1 });
};

contactSchema.statics.findPendingInquiries = async function () {
    return await this.find({ 
        status: { $in: ['new', 'in-progress'] } 
    }).sort({ createdAt: -1 });
};

contactSchema.statics.getStatsByType = async function () {
    return await this.aggregate([
        {
            $group: {
                _id: '$inquiryType',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
};

// Pre-save middleware to sanitize data
contactSchema.pre('save', function (next) {
    // Additional sanitization if needed
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase().trim();
    }
    next();
});

// Custom toJSON to control what gets returned
contactSchema.methods.toJSON = function () {
    const contact = this.toObject();
    // You can remove sensitive fields if needed
    return contact;
};

const Contact = model<IContact, ContactModel>('Contact', contactSchema);

export default Contact;