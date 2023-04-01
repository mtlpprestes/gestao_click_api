var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

const fs = require('fs');
const path = require('path');

function searchFolder(actualFolder, app) {
  const baseFiles = fs.readdirSync(actualFolder)
    .filter(file => file !== 'organizer.js');

  const files = baseFiles.filter(file => file.indexOf('.') !== -1);
  const folders = baseFiles.filter(file => file.indexOf('.') === -1);

  files.forEach(file => {
    require(path.join(actualFolder, file))(app);
  })

  folders.forEach(folder => {
    searchFolder(path.join(actualFolder, folder), app);
  });
}

module.exports = (app) => {
  searchFolder(__dirname, app);
};
