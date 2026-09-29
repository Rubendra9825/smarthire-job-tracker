/* ============================================================
   routes/applications.js — Application API routes
   ============================================================
   This file maps HTTP methods + URLs → controller functions.

   HOW ROUTING WORKS (for beginners):
     router.get('/')       → GET  /api/applications
     router.get('/:id')    → GET  /api/applications/3
     router.post('/')      → POST /api/applications
     router.put('/:id')    → PUT  /api/applications/3
     router.delete('/:id') → DELETE /api/applications/3

   The '/api/applications' prefix comes from server.js where
   we wrote: app.use('/api/applications', applicationRoutes)
   ============================================================ */

const express = require('express');
const router = express.Router();

const {
    getAllApplications,
    getApplication,
    createApplication,
    updateApplication,
    deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth'); // Protect middleware

// Apply protect to all internal application routes
// If a user is not logged in, any code below this line will be blocked.
router.use(protect);

// GET    /api/applications          → list all (with optional ?status & ?search)
// POST   /api/applications          → create new
router.route('/')
    .get(getAllApplications)
    .post(createApplication);

// GET    /api/applications/:id      → get one
// PUT    /api/applications/:id      → update one
// DELETE /api/applications/:id      → delete one
router.route('/:id')
    .get(getApplication)
    .put(updateApplication)
    .delete(deleteApplication);

module.exports = router;
