import ApiLog from '../models/ApiLog.js';

export const apiLogger = async (req, res, next) => {
  const start = Date.now();
  const bodyCopy = req.body ? JSON.parse(JSON.stringify(req.body)) : {};
  res.on('finish', async () => {
    try {
      await ApiLog.create({
        user: req.user?._id,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ip: req.ip,
        body: bodyCopy,
        createdAt: new Date()
      });
    } catch (e) {
      // swallow logging errors
    }
  });
  next();
};
