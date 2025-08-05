import { body } from 'express-validator';
import { jobStatus } from '../../constant/jobStatus';

export const validateCreateJob = [
    body('title').notEmpty().withMessage('Title is required'),
    body('company.name').notEmpty().withMessage('Company name is required'),
    body('description.details').notEmpty().withMessage('Job details are required'),
    body('description.stipend.currency').notEmpty().withMessage('Stipend currency is required'),
    body('description.stipend.amount').isNumeric().withMessage('Stipend amount must be a number'),
    body('skillsRequired').isArray().withMessage('Skills required must be an array of strings'),
    body('applicationDeadline').notEmpty().withMessage('Application deadline is required').isISO8601().toDate().withMessage('Invalid date format for application deadline'),
    body('company.logoUrl').optional().isURL().withMessage('Invalid URL format for logoUrl'),
    body('status').isIn(Object.values(jobStatus)).withMessage('Invalid job status'),
    body('company.industry').optional().isString().withMessage('Industry must be a string'),
    body('jobType').optional().isString().withMessage('Job type must be a string'),
    body('weeklyHours').optional().isNumeric().withMessage('Weekly hours must be a number'),
    body('isRemote').optional().isBoolean().withMessage('isRemote must be a boolean'),
    body('visibility.displayInApp').optional().isBoolean().withMessage('displayInApp must be a boolean'),
    body('visibility.featured').optional().isBoolean().withMessage('featured must be a boolean'),
];
