/*
 * This custom BibTeX parser was inspired by the tutorial at https://balit.boxxen.org/
 */
import { Entry } from './ast';

const WRITE_ORDER = [
  'author',
  'journal',
  'booktitle',
  'title',
  'year',
  'number',
  'editor',
  'pages',
  'publisher',
  'series',
  'volume',
  'bibsource',
  'biburl',
  'comment',
  'doi',
  'groups',
  'url',
]

// format a string to the length of the longest property name
const PROPERTY_LENGTH = Math.max.apply(Math, WRITE_ORDER.map(x => x.length))
function toPropertyLength(x: string) {
  const toAppend = PROPERTY_LENGTH - x.length
  return (toAppend > 0) ? x + ' '.repeat(toAppend) : x
}

// format a property key and value
function formatProperty(name: string, value: string) {
  return `,\n  ${toPropertyLength(name)} = {${value}}`
}

// filter keys that are not contained in the WRITE_ORDER
function remainingKeyFilter(x: string) {
  return !WRITE_ORDER.includes(x) && x !== 'entryType' && x !== 'bibKey'
}

export default function renderBibtex(entry: Entry) {
  const buffer = [ `@${entry.entryType}{${entry.bibKey}` ]
  for (let propertyName of WRITE_ORDER) {
    if (propertyName in entry) {
      buffer.push(formatProperty(propertyName, entry[propertyName]))
    }
  }
  for (let propertyName of Object.keys(entry).filter(remainingKeyFilter)) {
    console.log(`WARNING: the WRITE_ORDER of the property '${propertyName}' is unknown`)
    buffer.push(formatProperty(propertyName, entry[propertyName]))
  }
  buffer.push('\n}\n')
  return buffer.join('')
}
