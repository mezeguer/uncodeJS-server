const english = require('./en');
const spanish = require('./es');
const italian = require('./it');

class Translations {
  constructor() {
    this.dictionary = english;
  }
  setDictionary(language) {
    // 1 => english, 2 => spanish, 3 => italian
    // console.log(this.language)
    if (language === 1) this.dictionary = english;
    if (language === 2) this.dictionary = spanish;
    if (language === 3) this.dictionary = italian;
    // console.log(this.dictionary)
  }
}
const translations = new Translations();

module.exports = translations;