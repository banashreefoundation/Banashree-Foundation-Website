# Database Seeding Instructions

This directory contains scripts to populate the MongoDB database with sample data for testing and development purposes.

## Files

- **seedData.ts** - TypeScript script to insert 10 records each for Programs, Projects, Campaigns, and Events
- **seedData.json** - JSON reference file containing sample data structure

## Data Overview

The script creates **40 total records**:
- ✅ 10 Programs
- ✅ 10 Projects (linked to Programs)
- ✅ 10 Campaigns
- ✅ 10 Events

## Prerequisites

1. MongoDB should be running
2. Environment variables should be configured in `.env` file
3. Required packages should be installed

## How to Run

### Option 1: Using ts-node directly
```bash
cd server
npx ts-node src/scripts/seedData.ts
```

### Option 2: Add to package.json scripts
Add this to your `server/package.json`:
```json
{
  "scripts": {
    "seed": "ts-node src/scripts/seedData.ts"
  }
}
```

Then run:
```bash
cd server
npm run seed
```

### Option 3: Compile and run
```bash
cd server
npx tsc src/scripts/seedData.ts
node src/scripts/seedData.js
```

## What the Script Does

1. **Connects to MongoDB** using the connection string from environment variables
2. **Clears existing data** from Programs, Projects, Campaigns, and Events collections
3. **Inserts 10 Programs** with complete information
4. **Inserts 10 Projects** and links them to appropriate programs
5. **Inserts 10 Campaigns** with detailed campaign information
6. **Inserts 10 Events** with dates, venues, and other details
7. **Displays summary** of inserted records
8. **Disconnects** from MongoDB

## Sample Data Includes

### Programs
- Animal Welfare & Rescue Program
- Water Conservation Initiative
- Child Care & Education Program
- Elderly Care & Support
- Farmer Empowerment Program
- Community Building & Cultural Upliftment
- Gurukul Education System
- Women Empowerment Program
- Health & Wellness Program
- Environmental Conservation Program

### Projects
- Sacred Cow Sanctuary - Varur
- Community Pond Restoration - Hubli
- Scholarship Program for Girl Child
- Dignity Home for Senior Citizens
- Organic Farming Training Center
- Cultural Heritage Center
- Vedic Gurukul - Kundagol
- Women's Skill Development Center
- Mobile Health Clinic - Rural Outreach
- Green Karnataka - Tree Plantation Drive

### Campaigns
- Save Our Goshalas - Emergency Medical Fund
- Restore Village Ponds - Water for Future
- Educate a Girl Child - Transform a Family
- Dignity for Elders - Senior Care Expansion
- Organic Farming Revolution - Pesticide-Free Food
- Preserve Our Heritage - Traditional Arts Revival
- Vedic Gurukul - Scholarship Fund
- Women Entrepreneurs - Micro Business Fund
- Mobile Health Clinic - Reach the Unreached
- Plant 10,000 Trees - Green Karnataka Mission

### Events
- Annual Goshala Open Day (Feb 15, 2026)
- Water Conservation Workshop (Feb 28, 2026)
- Girl Education Success Stories (Mar 8, 2026)
- Senior Citizens Wellness Camp (Mar 15, 2026)
- Organic Farming Field Day (Mar 22, 2026)
- Cultural Heritage Festival (Apr 5-6, 2026)
- Gurukul Open House (Apr 12, 2026)
- Women Entrepreneurs Expo (Apr 20-21, 2026)
- Community Health Marathon (May 1, 2026)
- Green Karnataka Day (Jun 5, 2026)

## Expected Output

```
✅ Connected to MongoDB

🗑️  Clearing existing data...
✅ Existing data cleared

📚 Inserting Programs...
✅ Inserted 10 programs

📋 Inserting Projects...
✅ Inserted 10 projects

🎯 Inserting Campaigns...
✅ Inserted 10 campaigns

📅 Inserting Events...
✅ Inserted 10 events

==================================================
✨ DATABASE SEEDING COMPLETED SUCCESSFULLY ✨
==================================================
Programs: 10
Projects: 10
Campaigns: 10
Events: 10
Total Records: 40
==================================================

✅ Disconnected from MongoDB
```

## Notes

⚠️ **Warning**: This script will **delete all existing data** in the Programs, Projects, Campaigns, and Events collections before inserting new data.

- All data is realistic and relevant to the Banashree Foundation's work
- Projects are properly linked to their parent programs using ObjectIds
- Events have proper date/time scheduling for 2026
- Campaigns include detailed information suitable for fundraising
- Images paths are placeholders - actual images should be placed in the respective directories

## Troubleshooting

**Error: Cannot connect to MongoDB**
- Check if MongoDB is running
- Verify MONGODB_URI in .env file
- Ensure network connectivity

**Error: Module not found**
- Run `npm install` in the server directory
- Ensure all dependencies are installed

**TypeScript errors**
- Run `npm install --save-dev @types/node ts-node typescript`

## Data Structure Reference

See `seedData.json` for the complete data structure reference.
