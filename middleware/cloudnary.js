const cloudinary = require('cloudinary').v2;

    cloudinary.config({ 
    cloud_name: 'dcbmgl1uh',
    api_key: '142261292991553',
    api_secret: 'M5pSENUJaI3NLGrR7G7IksJMsr0'
  });

  module.exports = { cloudinary };