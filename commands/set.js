'use strict';

const fs = require('fs');

module.exports = {
  topic: 'accounts',
  command: 'set',
  description: 'Set an account as current account',
  help: '',
  args: [
    { name: 'user', required: true }
  ],
  run: function (context) {
    const login = context.args.user
    const home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
    let accounts = null
    try {
      accounts = JSON.parse(fs.readFileSync(home+'/.heroku/accounts.json'))
    } catch (ex) {
      if(ex.code === 'ENOENT') {
        console.log("No accounts saved.")
      } else {
        throw ex
      }
    }

    try {
      const netrclines = fs.readFileSync(home+'/.netrc').toString().split("\n")
      let newnetrc = []
      let inSection = false
      for(let i=0; i<netrclines.length; i++) {
        const l = netrclines[i];
        let newl = l
        if(l=="machine api.heroku.com" || l=="machine git.heroku.com") {
          inSection = true
        }
        if(l.match(/^  login/) && inSection) {
          newl = "  login "+login
        }
        if(l.match(/^  password/) && inSection) {
          newl = "  password "+accounts[login]
        }
        if(inSection && l.match(/^machine/) && l!="machine api.heroku.com" && l!="machine git.heroku.com") {
          inSection = false
        }
        newnetrc.push(newl)
      }
      fs.writeFileSync(home+"/.netrc", newnetrc.join("\n"))
    } catch(ex) {
      throw ex;
    }


  }
};
