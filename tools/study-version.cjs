const {createHash} = require('node:crypto');

function studyVersion(source) {
  // Git checkouts may use CRLF on Windows and LF on Linux. Content is the cache key.
  return createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex').slice(0, 12);
}

module.exports = {studyVersion};
