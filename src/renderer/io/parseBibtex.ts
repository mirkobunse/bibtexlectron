enum TokenType {
  VariableDeclaration = 'VariableDeclaration',
  AssignmentOperator = 'AssignmentOperator',
  Literal = 'Literal',
  String = 'String',
  LineBreak = 'LineBreak',
  Log = 'Log'
}

interface TokenNode<T extends TokenType> {
  type: T
}

interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
  value: string
}

type Token =
  TokenNode<TokenType.AssignmentOperator> |
  TokenNode<TokenType.VariableDeclaration> |
  TokenNode<TokenType.LineBreak> |
  TokenValueNode<TokenType.Literal> |
  TokenValueNode<TokenType.String>

const tokenStringMap: Array<{
  key: string,
  value: Token
}> = [
  { key: '\n', value: { type: TokenType.LineBreak } },
  { key: 'new', value: { type: TokenType.VariableDeclaration } },
  { key: '=', value: { type: TokenType.AssignmentOperator } },
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
  
  while (currentPosition < input.length) {
    const currentToken = input[currentPosition];

    // our language doesn't care about whitespace.
    if (currentToken === ' ') {
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
      currentPosition++;
      continue;
    }

    // match strings
    if (currentToken === "'") {
      currentPosition++; // skip over the opening '
      const bucket = lookahead(/[^']/);
      out.push({
        type: TokenType.String,
        value: bucket.join('')
      });
      currentPosition += bucket.length + 1;
      continue
    }

    // match literals
    const literalRegex = /[a-zA-Z]/;
    const literalRegexNext = /[a-zA-Z0-9]/;
    if (literalRegex.test(currentToken)) {
      const bucket = lookahead(literalRegex, literalRegexNext);
      out.push({
        type: TokenType.Literal,
        value: bucket.join('')
      });
      currentPosition += bucket.length;
    }
    currentPosition++;
  }

  return out;
}
