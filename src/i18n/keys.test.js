import en from './en';
import es from './es';
import de from './de';
import fr from './fr';
import it from './it';
import pt from './pt';
import nl from './nl';
import ca from './ca';
import pl from './pl';
import da from './da';
import sv from './sv';
import no from './no';
import tr from './tr';

const dictionaries = {
  es,
  de,
  fr,
  it,
  pt,
  nl,
  ca,
  pl,
  da,
  sv,
  no,
  tr
};

const englishKeys = Object.keys(en).sort();

describe('translation key parity', () => {
  Object.entries(dictionaries).forEach(([language, dictionary]) => {
    test(`${language} has exactly the English translation keys`, () => {
      const keys = Object.keys(dictionary).sort();
      const keySet = new Set(keys);
      const englishKeySet = new Set(englishKeys);
      const missing = englishKeys.filter((key) => !keySet.has(key));
      const extra = keys.filter((key) => !englishKeySet.has(key));

      if (missing.length > 0) {
        throw new Error(`${language} is missing English keys: ${missing.join(', ')}`);
      }

      if (extra.length > 0) {
        throw new Error(`${language} has keys not present in English: ${extra.join(', ')}`);
      }
    });
  });
});
