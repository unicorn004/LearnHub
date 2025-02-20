const axios = require('axios');

const checkToxicContent = async (text) => {
  try {
    const response = await axios.post('http://localhost:5234/mask-toxic', {
      sentence: text
    });

    if (!response.data || typeof response.data.success !== 'boolean') {
      return false;
    }

    return !response.data.success;
  } catch (error) {
    return false;
  }
};




module.exports = {
  checkToxicContent
};
