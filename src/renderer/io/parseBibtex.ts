/*
 * this custom BibTeX parser is based on a tutorial at https://balit.boxxen.org/
 */
import tokenize from './tokenize';
import ast from './ast';

export default function parseBibtex(input: string) {
  // return tokenize(input);
  return ast(tokenize(input));
}
