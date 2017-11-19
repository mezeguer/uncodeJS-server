const esprima = require('esprima')
const translations = require('./translations/config');
const OptionsMap = require('./options-map.js');

module.exports = (codeInput, language = 1) => {
  translations.setDictionary(language);
  const optionsMap = new OptionsMap(translations.dictionary).map
  try {
    const parsedCode = esprima.parseScript(codeInput).body;
    if (parsedCode.length) return parsedCode.map(el => optionsMap.get(el.type)(el)).join('\n');
    else return 'You have to type something entity manifest upon our plane of existence';
  } catch(err) {
    return err.description;
  }
};