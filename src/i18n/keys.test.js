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

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const languageContext = fs.readFileSync(
  path.resolve(__dirname, '../contexts/LanguageContext.js'),
  'utf8'
);

const getDictionaryKeys = (language) => {
  const ast = parser.parse(languageContext, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  const declaration = ast.program.body.find(
    (node) =>
      node.type === 'VariableDeclaration' &&
      node.declarations.some(
        (item) => item.id.type === 'Identifier' && item.id.name === 'translations'
      )
  );

  if (!declaration) {
    throw new Error('Could not find the translations dictionary in LanguageContext.js');
  }

  const translations = declaration.declarations.find(
    (item) => item.id.type === 'Identifier' && item.id.name === 'translations'
  ).init;
  const entry = translations.properties.find(
    (property) =>
      property.type === 'ObjectProperty' &&
      ((property.key.type === 'Identifier' && property.key.name === language) ||
        (property.key.type === 'StringLiteral' && property.key.value === language))
  );

  if (!entry || entry.value.type !== 'ObjectExpression') {
    throw new Error(`Could not find the "${language}" dictionary in LanguageContext.js`);
  }

  return entry.value.properties
    .filter((property) => property.type === 'ObjectProperty' && !property.computed)
    .map((property) =>
      property.key.type === 'Identifier' ? property.key.name : property.key.value
    )
    .sort();
};

const dictionaries = {
  es: getDictionaryKeys('es'),
  de,
  fr,
  it,
  pt,
  nl,
  ca,
  pl,
  da,
  sv,
  no
};

const englishKeys = getDictionaryKeys('en');

describe('translation key parity', () => {
  Object.entries(dictionaries).forEach(([language, dictionary]) => {
    test(`${language} has exactly the English translation keys`, () => {
      const keys = Array.isArray(dictionary)
        ? dictionary
        : Object.keys(dictionary).sort();
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
