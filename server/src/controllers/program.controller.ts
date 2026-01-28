import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Program } from '../model/programModel';
import { Types } from 'mongoose';

class ProgramController {
    public getAllPrograms: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const programs = await Program.find().sort({ _id: -1 });
        res.status(200).json({ success: true, data: programs });
      } catch (error) {
        next(error);
      }    
  };

  public createProgram: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newProgram = new Program(req.body);
      const savedProgram = await newProgram.save();
      res.status(201).json({ success: true, message: 'Program Created!', data: savedProgram });
    } catch (error) {
      next(error);
    }
  };

  public getProgramById: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid program id' });
        return;
      }

      const program = await Program.findById(id);
      if (!program) {
        res.status(404).json({ success: false, message: 'Program not found' });
        return;
      }
      res.status(200).json({ success: true, data: program });
    } catch (error) {
      next(error);
    }
  };

  public updateProgram: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid program id' });
        return;
      }

      const updatedProgram = await Program.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedProgram) {
        res.status(404).json({ success: false, message: 'Program not found' });
        return;
      }
      res.status(200).json({ success: true, message: `Program with id ${id} is updated.`, data: updatedProgram });
    } catch (error) {
      next(error);
    }
  };

  public deleteProgram: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid program id' });
        return;
      }

      const deletedProgram = await Program.findByIdAndDelete(id);
      if (!deletedProgram) {
        res.status(404).json({ success: false, message: 'Program not found' });
        return;
      }
      res.status(200).json({ success: true, message: `Program with id ${id} is deleted.` });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProgramController();