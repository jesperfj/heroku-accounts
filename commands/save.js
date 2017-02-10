'use strict';

const fs = require('fs');

module.exports = {
  topic: 'accounts',
  command: 'save',
  description: 'Save current account',
  help: '',
  run: function (context) {
    try {
      const home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
      const netrclines = fs.readFileSync(home+'/.netrc').toString().split("\n")
      let inSection = false
      let login;
      let password;
      for(let i=0; i<netrclines.length; i++) {
        let l = netrclines[i];
        if(l=="machine api.heroku.com") {
          inSection = true
        }
        if(l.match(/^  login/) && inSection) {
          login = l.substring(8);
        }
        if(l.match(/^  password/) && inSection) {
          password = l.substring(11);
        }
        if(login && password) {
          break;
        }
      }
      if(login && password) {
        const home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
        let accounts = JSON.parse(fs.readFileSync(home+'/.heroku/accounts.json'))
        accounts[login] = password
        fs.writeFileSync(home+'/.heroku/accounts.json',JSON.stringify(accounts))
        console.log("Saved "+login)

      } else {
        console.log("It doesn't look like you're logged in. Use `heroku login` to login first.")
      }
    } catch(ex) {
      throw ex;
    }
  }
};
