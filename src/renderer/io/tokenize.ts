/*
 * This custom BibTeX parser was inspired by the tutorial at https://balit.boxxen.org/
 */
export interface EntryToken { entryType: string, bibKey: string }
export interface FieldToken { field: string }
export interface ValueToken { value: string }
export type Token = EntryToken | FieldToken | ValueToken // union type

export function isEntryToken(x: Token): x is EntryToken {
  return x && 'entryType' in x && 'bibKey' in x
}
export function isFieldToken(x: Token): x is FieldToken {
  return x && 'field' in x
}
export function isValueToken(x: Token): x is ValueToken {
  return x && 'value' in x
}

export default function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let currentPosition = 0
  let openBrackets = 0

  // helper functions for strings and literals
  function lookahead(match: RegExp): string {
    const bucket: string[] = []
    while (true) {
      const nextIndex = currentPosition + bucket.length
      const nextToken = input[nextIndex]
      if (!nextToken)
        break
      let m: string | RegExp = match
      if (m && !m.test(nextToken))
        break
      bucket.push(nextToken)
    }
    return bucket.join('')
  }

  // main tokenization loop
  while (currentPosition < input.length) {
    const currentToken = input[currentPosition]

    // ignore whitespace and separators outside of fields
    if (openBrackets < 2 && [' ', '\n', ',', '='].includes(currentToken)) {
      currentPosition++
      continue
    }

    // count openBrackets; TODO support opening and closing quotation marks '"'
    if (currentToken === '{' && openBrackets < 2) { // openBrackets>=2 must belong to a field value
      openBrackets++
      currentPosition++
      continue
    } else if (currentToken === '}') {
      openBrackets--
      currentPosition++
      continue
    }

    // match EntryType
    if (openBrackets === 0 && currentToken === '@') {
      currentPosition++; // skip over the opening '@'
      const entryType = lookahead(/[^{]/); // TODO break on and skip whitespace
      currentPosition += entryType.length + 1; // skip the '{' separator
      openBrackets++
      const bibKey = lookahead(/[^,]/); // TODO break on and skip whitespace
      currentPosition += bibKey.length + 1; // skip the ',' separator
      tokens.push({ entryType, bibKey });
      continue
    }

    // match field names
    if (openBrackets === 1 && currentToken !== '{') {
      const field = lookahead(/[^=\s]/);
      tokens.push({ field });
      currentPosition += field.length + 1; // skip the '=' or '\s' separator
      continue
    }

    // match field values
    if (openBrackets > 1) {
      const parts: string[] = []
      while (openBrackets > 1) {
        const part = lookahead(/[^{}]/);
        currentPosition += part.length;
        parts.push(part)
        const bracket = input[currentPosition]
        currentPosition++
        if (bracket === '{')
          openBrackets++
        else if (bracket === '}')
          openBrackets--
        if (openBrackets > 1)
          parts.push(bracket)
      }
      tokens.push({ value: parts.join('') });
      continue
    }

    // skip everything that does not match
    currentPosition++
  }

  return tokens;
}
