// Simple endpoint de prueba
module.exports = async (req, res) => {
  const fs = require('fs');
  
  try {
    // Listar estructura de archivos
    const rootFiles = fs.readdirSync('/var/task');
    let structure = { rootFiles };
    
    if (rootFiles.includes('dist')) {
      structure.distFiles = fs.readdirSync('/var/task/dist');
      if (structure.distFiles.includes('src')) {
        structure.distSrcFiles = fs.readdirSync('/var/task/dist/src');
      }
    }
    
    return res.status(200).json({
      message: 'Debug endpoint funcionando',
      structure,
      paths: {
        __dirname,
        cwd: process.cwd()
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      __dirname,
      cwd: process.cwd()
    });
  }
};