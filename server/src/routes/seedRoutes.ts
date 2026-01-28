import { Router, Request, Response } from 'express';
import { execSync } from 'child_process';
import path from 'path';
import { Program } from '../model/programModel';
import { Project } from '../model/projectModel';
import Event from '../models/Event';
import { Campaign } from '../model/campaignModel';

const router = Router();

// Download JSON schema for specific entity type
router.get('/download-schema/:entityType', async (req: Request, res: Response): Promise<any> => {
  try {
    const { entityType } = req.params;

    // Define schema templates for each entity type
    const schemas: Record<string, any[]> = {
      programs: [
        {
          title: "Sample Program",
          tagline: "Brief tagline for the program",
          detailedDescription: "Detailed description of the program",
          goals: ["Goal 1", "Goal 2", "Goal 3"],
          media: {
            images: ["image1.jpg", "image2.jpg"],
            videos: ["video1.mp4"],
            gallery: ["gallery1.jpg", "gallery2.jpg"]
          },
          metrics: ["Metric 1", "Metric 2"],
          endorsement: "Endorsement text"
        }
      ],
      projects: [
        {
          projectName: "Sample Project",
          tagLine: "Brief tagline for the project",
          program: "60a1b2c3d4e5f6g7h8i9j0k1", // MongoDB ObjectId of the program (use existing program ID)
          projectObjective: "Main objective of the project",
          projectDescription: "Detailed description of the project",
          targetBeneficiaries: "Target beneficiaries description",
          projectLocation: "City, State",
          keyActivities: "Key activities description",
          expectedOutcome: "Expected outcomes description",
          collaboratingPartners: "Partner organizations",
          metrics: "Metrics description",
          endorsementAndPartnership: "Endorsement and partnership details (optional)",
          image: "project-image.jpg"
        }
      ],
      events: [
        {
          title: "Sample Event - MAKE THIS UNIQUE",
          description: "Description of the event",
          startDateTime: "2024-06-15T10:00:00.000Z",
          endDateTime: "2024-06-15T17:00:00.000Z",
          venue: "Venue Name, Address",
          focusAreas: "Focus areas of the event",
          program: "Program name (optional)",
          targetAudience: "Target audience description",
          objectives: "Event objectives",
          impact: "Expected impact",
          media: ["image1.jpg", "image2.jpg"],
          donateOption: true,
          pocDetails: "Contact Name, email@example.com, +1234567890",
          createdBy: "Admin",
          active: true,
          isEventEnabled: true
        }
      ],
      campaigns: [
        {
          title: "Sample Campaign",
          campaignID: "CAMP001",
          isActive: true,
          tagline: "Brief tagline for the campaign",
          goal: "Fundraising goal and target amount",
          campaignStory: "Detailed story of the campaign including who, why, what, and how",
          specificBreakdown: "Breakdown of how funds will be used (optional)",
          impactOfContribution: "Impact description of contributions",
          timeline: "Timeline and milestones",
          beneficiaryInformation: "Information about beneficiaries",
          mediaUrl: "/images/campaign-image.jpg",
          donateOption: "true",
          campaignUpdates: "Updates about the campaign (optional)",
          shareOptions: "true",
          endorsementsOrPartnerships: "Endorsements and partnerships (optional)"
        }
      ]
    };

    if (!schemas[entityType]) {
      return res.status(400).json({
        success: false,
        error: `Invalid entity type. Must be one of: ${Object.keys(schemas).join(', ')}`
      });
    }

    const schema = schemas[entityType];
    const filename = `${entityType}-schema.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(schema);
  } catch (error) {
    console.error('Error generating schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate schema template'
    });
  }
});

// Upload JSON data for specific entity type
router.post('/upload-json-data', async (req: Request, res: Response): Promise<any> => {
  try {
    const { entityType, data } = req.body;

    if (!entityType || !data) {
      return res.status(400).json({
        success: false,
        error: 'Entity type and data are required'
      });
    }

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'Data must be an array of records'
      });
    }

    // Select the appropriate model
    let Model;
    switch (entityType) {
      case 'programs':
        Model = Program;
        break;
      case 'projects':
        Model = Project;
        break;
      case 'events':
        Model = Event;
        break;
      case 'campaigns':
        Model = Campaign;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Invalid entity type: ${entityType}`
        });
    }

    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const record of data) {
      try {
        // Determine unique identifier based on entity type
        let uniqueIdentifier: any = {};
        let shouldUpsert = true;
        
        switch (entityType) {
          case 'programs':
            // Use title as unique identifier for programs
            if (record.title) {
              uniqueIdentifier = { title: record.title };
            } else {
              shouldUpsert = false; // No unique ID, just insert
            }
            break;
          case 'projects':
            // Use projectName as unique identifier for projects
            if (record.projectName) {
              uniqueIdentifier = { projectName: record.projectName };
            } else {
              shouldUpsert = false;
            }
            break;
          case 'events':
            // Use eventID if provided, otherwise use title, otherwise just insert
            if (record.eventID) {
              uniqueIdentifier = { eventID: record.eventID };
            } else if (record.title) {
              uniqueIdentifier = { title: record.title };
            } else {
              shouldUpsert = false;
            }
            break;
          case 'campaigns':
            // Use campaignID if provided, otherwise use title
            if (record.campaignID) {
              uniqueIdentifier = { campaignID: record.campaignID };
            } else if (record.title) {
              uniqueIdentifier = { title: record.title };
            } else {
              shouldUpsert = false;
            }
            break;
        }

        if (shouldUpsert && Object.keys(uniqueIdentifier).length > 0) {
          // Upsert: update if exists, insert if not
          await (Model as any).findOneAndUpdate(
            uniqueIdentifier,
            record,
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            }
          );
        } else {
          // Just insert as new record
          await (Model as any).create(record);
        }

        inserted++;
      } catch (err: any) {
        errors.push(`Failed to process record: ${err.message}`);
        console.error(`Error processing record:`, err);
      }
    }

    if (errors.length > 0) {
      res.status(207).json({
        success: true,
        message: `Processed ${data.length} records with ${errors.length} errors`,
        inserted,
        updated,
        errors: errors.slice(0, 10) // Limit error messages
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Successfully processed ${inserted} ${entityType} records`,
        inserted,
        updated: 0
      });
    }
  } catch (error: any) {
    console.error('Upload JSON data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload JSON data',
      details: error.message
    });
  }
});

// Seed data endpoint
router.post('/seed-data', async (req: Request, res: Response): Promise<any> => {
  try {
    const { cleanMode } = req.body;
    
    console.log(`Starting seed operation in ${cleanMode ? 'CLEAN' : 'UPSERT'} mode`);
    
    // Set environment variable for clean mode
    const envVar = cleanMode ? 'CLEAN_DATABASE=true' : 'CLEAN_DATABASE=false';
    
    // Execute the compiled seed script (use .js from build folder, not .ts)
    const seedScriptPath = path.join(__dirname, '../scripts/seedData.js');
    const command = `${envVar} node ${seedScriptPath}`;
    
    try {
      const output = execSync(command, {
        cwd: path.join(__dirname, '../..'),
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      console.log('Seed script output:', output);
      
      res.status(200).json({
        success: true,
        message: `Database ${cleanMode ? 'cleaned and' : ''} seeded successfully!`,
        mode: cleanMode ? 'clean' : 'upsert',
        output: output
      });
    } catch (execError: any) {
      console.error('Seed script execution error:', execError.message);
      console.error('Stderr:', execError.stderr);
      console.error('Stdout:', execError.stdout);
      
      res.status(500).json({
        success: false,
        error: 'Seed script execution failed',
        details: execError.message,
        stderr: execError.stderr,
        stdout: execError.stdout
      });
    }
  } catch (error: any) {
    console.error('Seed data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed database',
      details: error.message
    });
  }
});

// Upload default images endpoint
router.post('/upload-default-images', async (req: Request, res: Response): Promise<any> => {
  try {
    const defaultImagesPath = path.join(__dirname, '../data/default-images.json');
    const defaultImages = require(defaultImagesPath);
    
    // Import the Image model
    const { default: Image } = await import('../models/Image');
    
    let uploadedCount = 0;
    const errors: string[] = [];
    
    for (const imageData of defaultImages) {
      try {
        await Image.findOneAndUpdate(
          { 
            category: imageData.category,
            key: imageData.key
          },
          imageData,
          { 
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );
        uploadedCount++;
      } catch (err: any) {
        errors.push(`Failed to upload ${imageData.name}: ${err.message}`);
        console.error(`Error uploading image ${imageData.name}:`, err);
      }
    }
    
    if (errors.length > 0) {
      res.status(207).json({
        success: true,
        message: `Uploaded ${uploadedCount} images with ${errors.length} errors`,
        count: uploadedCount,
        errors: errors
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Successfully uploaded ${uploadedCount} default images`,
        count: uploadedCount
      });
    }
  } catch (error: any) {
    console.error('Upload default images error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload default images',
      details: error.message
    });
  }
});

export default router;
