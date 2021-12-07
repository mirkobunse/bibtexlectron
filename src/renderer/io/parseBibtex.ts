/*
 * this custom BibTeX parser is based on a tutorial at https://balit.boxxen.org/
 */

enum TokenType {
  EntryType = 'EntryType',
  OpeningBracket = 'OpeningBracket',
  ClosingBracket = 'ClosingBracket',
  Equals = 'Equals',
  Comma = 'Comma',
  Literal = 'Literal'
}

interface TokenNode<T extends TokenType> {
  type: T
}

interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
  value: string
}

type Token =
  TokenValueNode<TokenType.EntryType> |
  TokenNode<TokenType.OpeningBracket> |
  TokenNode<TokenType.ClosingBracket> |
  TokenNode<TokenType.Equals> |
  TokenNode<TokenType.Comma> |
  TokenValueNode<TokenType.Literal>

const tokenStringMap: Array<{
  key: string,
  value: Token
}> = [
  { key: '{', value: { type: TokenType.OpeningBracket } },
  { key: '}', value: { type: TokenType.ClosingBracket } },
  { key: '=', value: { type: TokenType.Equals } },
  { key: ',', value: { type: TokenType.Comma } },
]

export function tokenize(input: string): Token[] {
  const out: Token[] = [];
  let currentPosition = 0;

  // helper function for the tokenStringMap
  function lookaheadString(str: string): boolean {
    const parts = str.split('');
    for (let i = 0; i < parts.length; i++) {
      if (input[currentPosition + i] !== parts[i]) {
        return false;
      }
    }
    return true;
  }

  // helper functions for strings and literals
  function lookahead(match: RegExp, matchNext?: RegExp): string[] {
    const bucket: string[] = []

    while (true) {
      const nextIndex = currentPosition + bucket.length
      const nextToken = input[nextIndex]
      if (!nextToken) {
        break
      }
      let m: string | RegExp = match
      if (matchNext && bucket.length) {
        m = matchNext
      }
      if (m && !m.test(nextToken)) {
        break
      }
      bucket.push(nextToken)
    }

    return bucket
  }

  // main tokenization loop
  while (currentPosition < input.length) {
    const currentToken = input[currentPosition];

    // our language doesn't care about whitespace
    if (currentToken === ' ' || currentToken === '\n') {
      currentPosition++;
      continue;
    }

    // match tokens from the tokenStringMap
    let isKeyword: boolean = false;
    for (const { key, value } of tokenStringMap) {
      if (lookaheadString(key)) {
        out.push(value)
        currentPosition += key.length;
        isKeyword = true;
        break
      }
    }
    if (isKeyword) {
      continue;
    }

    // match EntryType
    if (currentToken === '@') {
      currentPosition++; // skip over the opening '
      const bucket = lookahead(/[^{}=\s,]/);
      out.push({
        type: TokenType.EntryType,
        value: bucket.join('')
      });
      out.push({
        type: TokenType.OpeningBracket
      }); // add the OpeningBracket immediately
      currentPosition += bucket.length + 1;
      continue
    }

    // match literals
    const bucket = lookahead(/[^{}=\s,]/);
    out.push({
      type: TokenType.Literal,
      value: bucket.join('')
    });
    currentPosition += bucket.length;
  }

  return out;
}
