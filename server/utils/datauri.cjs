const DataUriParser = require("datauri/parser.js");
const path = require("path");

const getDataUri = (file) => {
    if (!file || !file.buffer) {
        throw new Error("File or file buffer is missing");
    }

    const parser = new DataUriParser();
    return parser.format(path.extname(file.originalname).toString(), file.buffer);
};

module.exports = getDataUri;