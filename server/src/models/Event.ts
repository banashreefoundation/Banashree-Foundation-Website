import mongoose, { Schema, model, Document } from 'mongoose';
// import * as AutoIncrementFactory from 'mongoose-sequence';

// const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

interface IUpdateHistory {
    message: string;
    updatedBy: string;
    updatedAt: Date;
}

interface IEvent extends Document {
    eventID: number;
    title: string;
    description: string;
    startDateTime: Date;
    endDateTime: Date;
    venue: string;
    focusAreas: string;
    program?: string;
    targetAudience: string;
    objectives: string;
    impact: string;
    media: string[];
    donateOption: boolean;
    pocDetails: string;
    createdAt: Date;
    createdBy: string;
    updateHistory: IUpdateHistory[];
    active: boolean;
    isEventEnabled: boolean;
}

const updateHistorySchema = new Schema<IUpdateHistory>({
    message: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const eventSchema = new Schema<IEvent>({
    eventID: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    focusAreas: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        required: false,
    },
    targetAudience: {
        type: String,
        required: true,
    },
    objectives: {
        type: String,
        required: true,
    },
    impact: {
        type: String,
        required: true,
    },
    media: {
        type: [String],
        required: false,
    },
    donateOption: {
        type: Boolean,
        required: true,
    },
    pocDetails: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String,
        required: true,
    },
    updateHistory: {
        type: [updateHistorySchema],
        default: [],
    },
    active: {
        type: Boolean,
        default: true,
    },
    isEventEnabled: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

eventSchema.plugin(AutoIncrement, { inc_field: 'eventID' });

const Event = model<IEvent>('Event', eventSchema);

export default Event;