import express from 'express';
const router = express.Router();
import {PackageSearch,PackageHardDelete,PackageDelete,PackageUpdate,PackageGetById,PackageFetch,PackageCreate} from '../controllers/unlimitedPackage.js';


// Create a new package
router.post('/package', PackageCreate);

// Get all packages
router.get('/packages', PackageFetch);

// Get single package by ID
router.get('/package/:id', PackageGetById);

// Search packages with filters
router.get('/packages/search', PackageSearch);


// Update a package by ID
router.put('/package/:id', PackageUpdate);

// DELETE Routes
// Soft delete a package (set isActive: false)
router.delete('/package/:id', PackageDelete);

// Hard delete a package (permanently remove)
router.delete('/package/:id/hard', PackageHardDelete);

export default router;