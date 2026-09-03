/**
 * Async handler wrapper to eliminate try-catch boilerplate in route controllers
 * @param {Function} fn - Async controller function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
