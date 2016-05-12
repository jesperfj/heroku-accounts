'use strict';

const fs = require('fs');

module.exports = {
  topic: 'accounts',
  command: 'list',
  default: true,
  description: 'Lists saved accounts',
  help: '',
  run: function (context) {
    try {
      const home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
      const accounts = JSON.parse(fs.readFileSync(home+'/.heroku/accounts.json'))
      console.log(Object.keys(accounts).join("\n"))
      // console.log(accounts.keys.join("\n"))
    } catch (ex) {
      if(ex.code === 'ENOENT') {
        console.log("No accounts saved.")
      } else {
        throw ex
      }
    }
  }
};
