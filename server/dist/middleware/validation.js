"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: errors,
                });
            }
            return res.status(400).json({
                success: false,
                error: 'Invalid request data',
            });
        }
    };
};
exports.validateRequest = validateRequest;
