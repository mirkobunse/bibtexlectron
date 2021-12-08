/*
 * This custom BibTeX parser was inspired by the tutorial at https://balit.boxxen.org/
 */
import { Token, isEntryToken, isFieldToken, isValueToken } from './tokenize';

export interface DocumentNode { entries: EntryNode[] }
interface EntryNode { fields: FieldNode[] }
interface FieldNode { key: string, value: string }

export default function ast(tokens: Token[]): DocumentNode {
  console.log(tokens);
  let currentIndex = 0;

  // helper function to proceed to the next token of a specific type
  function proceedUntil(condition: Function): void {
    while (currentIndex < tokens.length) {
      const currentToken = tokens[currentIndex]
      if (condition(currentToken))
        break
      currentIndex++
    }
  }

  // collect all entries
  const entries: EntryNode[] = [];
  proceedUntil(isEntryToken) // skip all tokens until the first EntryType
  while (currentIndex < tokens.length) {
    const currentEntry = tokens[currentIndex]
    if (isEntryToken(currentEntry)) {
      currentIndex++

      // collect all fields
      const fields: FieldNode[] = [
        { key: "entryType", value: currentEntry.entryType },
        { key: "bibKey", value: currentEntry.bibKey }
      ]
      proceedUntil((x: Token) => isFieldToken(x) || isEntryToken(x))
      while (currentIndex < tokens.length) {
        const currentField = tokens[currentIndex]
        if (isFieldToken(currentField)) {
          currentIndex++

          // retrieve the value of the current field
          proceedUntil((x: Token) => isValueToken(x) || isEntryToken(x))
          const currentValue = tokens[currentIndex]
          if (isValueToken(currentValue)) {
            currentIndex++
            fields.push({ key: currentField.field, value: currentValue.value })
            proceedUntil((x: Token) => isFieldToken(x) || isEntryToken(x))
          } else break
        } else break
      }
      entries.push({ fields })
      proceedUntil(isEntryToken);

    } else break
  }
  return { entries }
}
