import { Component } from 'react';
import { Container } from 'semantic-ui-react';

export default class TextView extends Component {
  render() {
    return (
      <Container>
        {this.props.content}
      </Container>
    )
  }
}
