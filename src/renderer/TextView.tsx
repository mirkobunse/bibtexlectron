import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import fs from 'fs';

// callback factory for file changes
function handleChange(textView) {
  return (event) => {
    const path = event.target.files[0].path;
    console.log(path);
    textView.displayFile(path);
  }
}

// callback factory for clicks on any "open" button
function showFileDialog(textView) {
  return () => {
    textView.fileRef.current.click();
  }
}

export default class TextView extends Component {
  private readonly fileRef : RefObject<HTMLInputElement>

  constructor(props) {
    super(props);
    this.state = {};
    this.fileRef = React.createRef();
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
        <input
          ref={this.fileRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleChange(this)}
        />
        <p onClick={showFileDialog(this)}>{this.state.content}</p>
      </Container>
    )
  }
}
