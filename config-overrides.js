const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias['@artifacts'] = path.resolve(__dirname, 'src/Artifacts');
  return config;
};