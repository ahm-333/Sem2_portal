module.exports = {
  // Include data and renderer scripts: their complete color tokens are part of the UI.
  content: ['./index.html', './subject.html', './js/**/*.js'],
  darkMode: 'class',
  theme: { extend: { fontFamily: { cairo: ['Cairo','sans-serif'], mono: ['JetBrains Mono','monospace'] } } }
};
