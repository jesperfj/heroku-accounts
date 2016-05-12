'use strict';
exports.topic = {
  name: 'accounts',
  // this is the help text that shows up under `heroku help`
  description: 'Switch accounts'
};

exports.commands = [
  require('./commands/list.js'),
  require('./commands/save.js'),
  require('./commands/set.js')
];
