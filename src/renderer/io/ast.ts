/*
 * this custom BibTeX parser is based on a tutorial at https://balit.boxxen.org/
 */
import { Token, TokenType } from './tokenize';

enum NodeType {
  Document = 'Document',
  Entry = 'Entry',
  Field = 'Field'
}

interface FieldNode {
  type: NodeType.Field,
  key: string,
  value: string
}

interface EntryNode {
  type: NodeType.Entry,
  fields: FieldNode[]
}

interface DocumentNode {
  type: NodeType.Document,
  entries: EntryNode[]
}

export type Node =
  FieldNode |
  EntryNode |
  DocumentNode

export default function ast(tokens: Token[]): Node {
  console.log(tokens);
  let currentIndex = 0;
  let openBrackets = 0;

  function processLiteral() : string | null {
    const currentToken = tokens[currentIndex];
    if (currentToken.type === TokenType.Literal) {
      const currentValue = currentToken.value;
      currentIndex++; // step forward
      return currentValue;
    }
    else return null
  }

  function processField() : FieldNode | null {
    const key = processLiteral(); // the first literal is the key
    if (key) {
      currentIndex++; // skip the OpeningBracket that must follow
      openBrackets++; // now we need to start counting brackets
      const literalParts: string[] = [];
      while (currentIndex < tokens.length) {
        const currentToken = tokens[currentIndex];
        currentIndex++;
        if (currentToken.type === TokenType.OpeningBracket) {
          literalParts.push("{")
          openBrackets++;
        } else if (currentToken.type === TokenType.ClosingBracket) {
          openBrackets--;
          if (openBrackets == 0) { // is the last bracket closed?
            return {
              type: NodeType.Field,
              key,
              value: literalParts.join('')
            }
          } else literalParts.push("}");
        } else if (currentToken.type === TokenType.Literal) {
          literalParts.push(currentToken.value);
        }
      }
    }
    return null;
  }

  function processFields(entryType: string, bibKey: string) : FieldNode[] {
    const fields: FieldNode[] = [
      {
        type: NodeType.Field,
        key: 'entryType',
        value: entryType
      },
      {
        type: NodeType.Field,
        key: 'bibKey',
        value: bibKey
      }
    ];
    while (currentIndex < tokens.length) {
      const currentField = processField();
      currentIndex++;
      if (currentField)
        fields.push(currentField);
    }
    return fields
  }

  // collect all entries
  const entries: EntryNode[] = [];
  while (currentIndex < tokens.length) {
    const currentToken = tokens[currentIndex];
    currentIndex++;
    if (currentToken.type === TokenType.EntryType) {
      const entryType = currentToken.value;
      currentIndex++; // skip the OpeningBracket that must follow
      const bibKey = processLiteral(); // the first literal is the bibKey
      console.log("Parsing EntryType ", entryType, bibKey);
      if (entryType !== null && bibKey !== null) {
        entries.push({
          type: NodeType.Entry,
          fields: processFields(entryType, bibKey)
        });
      }
    }
  }

  return {
    type: NodeType.Document,
    entries
  }
}
