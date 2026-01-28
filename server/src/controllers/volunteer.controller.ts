import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Volunteer } from '../model/volunteerModel';
import { Types } from 'mongoose';

class VolunteerController {
    public getAllVolunteers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const volunteer = await Volunteer.find().sort({ _id: -1 });
        res.status(200).json({ success: true, data: volunteer });
      } catch (error) {
        next(error);
      }    
  };

  public createVolunteer: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newVolunteer = new Volunteer(req.body);
      const savedVolunteer = await newVolunteer.save();
      res.status(201).json({ success: true, message: 'Volunteer Created!', data: savedVolunteer });
    } catch (error) {
      next(error);
    }
  };

  public getVolunteerById: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid Volunteer id' });
        return;
      }

      const volunteer = await Volunteer.findById(id);
      if (!volunteer) {
        res.status(404).json({ success: false, message: 'Volunteer not found' });
        return;
      }
      res.status(200).json({ success: true, data: volunteer });
    } catch (error) {
      next(error);
    }
  };

  public updateVolunteer: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid Volunteer id' });
        return;
      }

      const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedVolunteer) {
        res.status(404).json({ success: false, message: 'Volunteer not found' });
        return;
      }
      res.status(200).json({ success: true, message: `Volunteer with id ${id} is updated.`, data: updatedVolunteer });
    } catch (error) {
      next(error);
    }
  };

  public deleteVolunteer: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid Volunteer id' });
        return;
      }

      const deletedVolunteer = await Volunteer.findByIdAndDelete(id);
      if (!deletedVolunteer) {
        res.status(404).json({ success: false, message: 'Volunteer not found' });
        return;
      }
      res.status(200).json({ success: true, message: `Volunteer with id ${id} is deleted.` });
    } catch (error) {
      next(error);
    }
  };
}

export default new VolunteerController();