import { Component } from 'react';
import { Container } from 'semantic-ui-react';
import fs from 'fs';

export default class TextView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  displayFile(path) {
    fs.readFile(
      path,
      'utf-8',
      (err, data) => {
        if (err) throw err;
        this.setState({ content: data.toString() }); // trigger an update of this component
      }
    );
  }
  componentDidMount() {
    this.displayFile('/home/bunse/Repos/bibtexlectron/assets/test.bib');
      // path.resolve(__dirname, './assets/test.bib'),
  }
  render() {
    return (
      <Container>
        {this.state.content}
      </Container>
    )
  }
}
