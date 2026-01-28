import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/auth';
import Event from '../models/Event';
import { Types } from 'mongoose';

// Create a new event
export const createEvent = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const event = new Event({
            ...req.body,
            createdBy: req.user?.email, // Assuming req.user.email contains the logged-in user's email
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values((error as any).errors).map(err => (err as any).message);
                return res.status(400).json({ error: 'Validation failed', details: validationErrors });
            }
            return res.status(400).json({ error: 'An error occurred while processing your request. Please try again later.' });
        }
        console.error('An unknown error occurred', error);
        return res.status(400).json({ error: 'An unknown error occurred. Please try again later.' });
    }
};

// Get all active events
export const getAllEvents = async (req: Request, res: Response): Promise<any> => {
    try {
        const events = await Event.find({ active: true });
        return res.status(200).json(events);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(500).json({ error: 'An error occurred while retrieving events. Please try again later.' });
        }
        console.error('An unknown error occurred', error);
        return res.status(500).json({ error: 'An unknown error occurred. Please try again later.' });
    }
};

// Get all enabled events
export const getEnabledEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const events = await Event.find({ isEventEnabled: req.params.value  });
    return res.status(200).json(events);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({
        error: 'An error occurred while retrieving events. Please try again later.'
      });
    }
    console.error('An unknown error occurred', error);
    return res.status(500).json({
      error: 'An unknown error occurred. Please try again later.'
    });
  }
};


// Get a single event by _id
export const getEventById = async (req: Request, res: Response): Promise<any> => {
    try {
        const event = await Event.findOne({ _id: req.params.id });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        return res.status(200).json(event);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(500).json({ error: 'An error occurred while retrieving the event. Please try again later.' });
        }
        console.error('An unknown error occurred', error);
        return res.status(500).json({ error: 'An unknown error occurred. Please try again later.' });
    }
};

// Update an event by _id
// only event owners can update the event
export const updateEvent = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid _id for the event.' });
            return;
      }
        const event = await Event.findOne({ _id: req.params.id });
        if (!event || !event.active) {
            return res.status(404).json({ error: 'Event not found or inactive.' });
        }
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: false });
        if (!updatedEvent) {
        res.status(400).json({ success: false, message: 'Event not Updated' });
        return;
        }
        res.status(200).json({ success: true, message: `Event with id ${id} is updated.`, data: updatedEvent });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(400).json({ error: 'An error occurred while updating the event. Please try again later.' });
        }
        console.error('An unknown error occurred', error);
        return res.status(400).json({ error: 'An unknown error occurred. Please try again later.' });
    }
};

// Delete an event by _id (soft delete)
// only event owners can delete or make the event inactive
export const deleteEvent = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const event = await Event.findOne({ _id: req.params.id });
        if (!event || !event.active) {
            return res.status(404).json({ error: 'Event not found or inactive.' });
        }

        if (event.createdBy !== req.user?.email) {
            return res.status(403).json({ error: 'You are not authorized to make this event inactive.' });
        }

        event.active = false;
        await event.save();

        return res.status(200).json({ message: 'Event is made inactive successfully' });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(500).json({ error: 'An error occurred while making the event inactive. Please try again later.' });
        }
        console.error('An unknown error occurred', error);
        return res.status(500).json({ error: 'An unknown error occurred. Please try again later.' });
    }
};