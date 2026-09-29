/* ============================================================
   controllers/applicationController.js  (Stage 4: Mongoose)
   ============================================================
   STAGE 4 CHANGE: Removed the in-memory `apps` array entirely.
   Every function now uses async/await with Mongoose methods:

   | Stage 3 (in-memory)          | Stage 4 (Mongoose)                    |
   |------------------------------|---------------------------------------|
   | apps array in memory         | MongoDB "applications" collection     |
   | apps.filter(...)             | Application.find({ status })          |
   | apps.find(a => a.id === id)  | Application.findById(id)              |
   | apps.push(newApp)            | Application.create(data)              |
   | apps[idx] = {...}            | Application.findByIdAndUpdate(id,...) |
   | apps.splice(idx, 1)          | Application.findByIdAndDelete(id)     |

   Note: MongoDB auto-generates a unique `_id` for each document.
   This replaces the manual `nextId` counter we had in Stage 3.
   ============================================================ */

const Application = require('../models/Application');

// ── GET ALL APPLICATIONS ──────────────────────────────────────
// GET /api/applications
// Optional query params: ?status=Interview  ?search=google

const getAllApplications = async (req, res, next) => {
    try {
        // Stage 5: Only get applications belonging to logged in user
        const filter = { user: req.user.id };

        if (req.query.status && req.query.status !== 'All') {
            filter.status = req.query.status;
        }

        // Case-insensitive search across company, jobTitle, location
        // $regex is MongoDB's way of doing "contains" text matching
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { company: searchRegex },
                { jobTitle: searchRegex },
                { location: searchRegex },
            ];
        }

        // .sort('-applicationDate') = newest first
        const apps = await Application.find(filter).sort('-applicationDate');

        res.json({ success: true, count: apps.length, data: apps });

    } catch (err) {
        next(err); // passes to errorHandler.js
    }
};

// ── GET SINGLE APPLICATION ────────────────────────────────────
// GET /api/applications/:id

const getApplication = async (req, res, next) => {
    try {
        const app = await Application.findById(req.params.id);

        if (!app) {
            return res.status(404).json({
                success: false,
                message: `Application not found with id: ${req.params.id}`,
            });
        }

        // Explicitly check ownership
        if (app.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: `User is not authorized to access this application`,
            });
        }

        res.json({ success: true, data: app });

    } catch (err) {
        // Mongoose throws a CastError if :id format is invalid (not a valid ObjectId)
        // errorHandler.js catches this and returns a clean 404
        next(err);
    }
};

// ── CREATE APPLICATION ────────────────────────────────────────
// POST /api/applications
// Body: { company, jobTitle, location, jobType, salary, status,
//         applicationDate, interviewDate, jobUrl, notes }

const createApplication = async (req, res, next) => {
    try {
        // Inject the user's ID from the JWT token into the request body
        req.body.user = req.user.id;

        // Application.create() validates against the Mongoose schema
        // defined in models/Application.js, then saves to MongoDB
        const app = await Application.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Application created successfully.',
            data: app,
        });

    } catch (err) {
        // Mongoose ValidationError (missing required field, wrong enum value)
        // is caught by errorHandler.js and returns a 400 with a clear message
        next(err);
    }
};

// ── UPDATE APPLICATION ────────────────────────────────────────
// PUT /api/applications/:id

const updateApplication = async (req, res, next) => {
    try {
        let app = await Application.findById(req.params.id);

        if (!app) {
            return res.status(404).json({
                success: false,
                message: `Application not found with id: ${req.params.id}`,
            });
        }

        // Check ownership
        if (app.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: `User is not authorized to update this application`,
            });
        }

        app = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,  // return the UPDATED doc, not the old one
                runValidators: true,  // validate the new values against the schema
            }
        );

        res.json({
            success: true,
            message: 'Application updated successfully.',
            data: app,
        });

    } catch (err) {
        next(err);
    }
};

// ── DELETE APPLICATION ────────────────────────────────────────
// DELETE /api/applications/:id

const deleteApplication = async (req, res, next) => {
    try {
        const app = await Application.findById(req.params.id);

        if (!app) {
            return res.status(404).json({
                success: false,
                message: `Application not found with id: ${req.params.id}`,
            });
        }

        // Check ownership
        if (app.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: `User is not authorized to delete this application`,
            });
        }

        await app.deleteOne(); // Use deleteOne() on the document instance

        res.json({
            success: true,
            message: `Application "${app.company}" deleted successfully.`,
            data: app,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllApplications,
    getApplication,
    createApplication,
    updateApplication,
    deleteApplication,
};
