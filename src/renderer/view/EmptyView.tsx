import { Component } from 'react';
import { Container } from 'semantic-ui-react';

export default class EmptyView extends Component {
  render() {
    return (
      <Container className="empty-view">
        Press "ctrl + o" to open a file
      </Container>
    )
  }
}
