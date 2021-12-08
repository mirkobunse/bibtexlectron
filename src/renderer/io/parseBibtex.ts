/*
 * This custom BibTeX parser was inspired by the tutorial at https://balit.boxxen.org/
 */
import tokenize from './tokenize';
import ast from './ast';

export default function parseBibtex(input: string) {
  return ast(tokenize(input));
}
