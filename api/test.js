module.exports = async (req, res) => {
  res.status(200).json({
    message: 'API Test Working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    vercel: !!process.env.VERCEL,
    paths: {
      __dirname,
      cwd: process.cwd()
    }
  });
};