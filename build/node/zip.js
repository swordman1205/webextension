const fs = require('fs');
const zip = require('zip-folder')

let run = function (version,zipfile) {
  'use strict'
  let filename = 'dist/manifest.json'
  let manifest
  fs.readFile(filename, (e,d) => {
    manifest = JSON.parse(d)
    manifest.version = version
    fs.writeFile(filename, JSON.stringify(manifest,null,2), function (err) {
      if (err) return console.log(err);
      zip('dist',zipfile, (e) => {
        if (e) {
          console.log(`Error creating ${zipfile}`)
        } else {
          console.log(`Successfully created ${zipfile}`)
        }
      })
    });
  })
}

module.exports = {
  run: run
}
