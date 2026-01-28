import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Project } from '../model/projectModel';
import { Types } from 'mongoose';
import { ProgramInterface } from 'model/programModel';

class ProjectController {
    public getAllProjects: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const projects = await Project.find().populate('program', 'title').lean().sort({ _id: -1 })
        const formattedProjects = projects.map(project => ({...project,
          program: typeof project.program === "object" && project.program !== null ? (project.program as ProgramInterface).title : project.program}))
        res.status(200).json({ success: true, data: formattedProjects });
      } catch (error) {
        next(error);
      }    
  };

  public createProject: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newProject = new Project(req.body);
      const savedProject = await newProject.save();
      res.status(201).json({ success: true, message: 'Project Created!', data: savedProject });
    } catch (error) {
      next(error);
    }
  };

  public getProjectById: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid project id' });
        return;
      }

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  };

  public updateProject: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid project id' });
        return;
      }

      const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedProject) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }
      res.status(200).json({ success: true, message: `Project with id ${id} is updated.`, data: updatedProject });
    } catch (error) {
      next(error);
    }
  };

  public deleteProject: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Invalid project id' });
        return;
      }

      const deletedProject = await Project.findByIdAndDelete(id);
      if (!deletedProject) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }
      res.status(200).json({ success: true, message: `Project with id ${id} is deleted.` });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProjectController();