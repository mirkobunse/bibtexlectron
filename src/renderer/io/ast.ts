/*
 * This custom BibTeX parser was inspired by the tutorial at https://balit.boxxen.org/
 */
import { Token, isEntryToken, isFieldToken, isValueToken } from './tokenize'

// Entry is a type alias for a string->string mapping
export type Entry = { [fieldName: string]: string }

export default function ast(tokens: Token[]): Entry[] {
  console.log(tokens)
  let currentIndex = 0

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
  const entries: Entry[] = []
  proceedUntil(isEntryToken) // skip all tokens until the first EntryType
  while (currentIndex < tokens.length) {
    const currentEntryToken = tokens[currentIndex]
    if (isEntryToken(currentEntryToken)) {
      currentIndex++

      // collect all fields
      const entry: Entry = {
        entryType: currentEntryToken.entryType,
        bibKey: currentEntryToken.bibKey
      }
      proceedUntil((x: Token) => isFieldToken(x) || isEntryToken(x))
      while (currentIndex < tokens.length) {
        const currentFieldToken = tokens[currentIndex]
        if (isFieldToken(currentFieldToken)) {
          currentIndex++

          // retrieve the value of the current field
          proceedUntil((x: Token) => isValueToken(x) || isEntryToken(x))
          const currentValueToken = tokens[currentIndex]
          if (isValueToken(currentValueToken)) {
            currentIndex++
            entry[currentFieldToken.field] = currentValueToken.value
            proceedUntil((x: Token) => isFieldToken(x) || isEntryToken(x))
          } else break
        } else break
      }
      entries.push(entry)
      proceedUntil(isEntryToken)

    } else break
  }
  return entries
}
