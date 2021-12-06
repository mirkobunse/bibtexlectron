import { Component } from 'react';
import { Container } from 'semantic-ui-react';
import EmptyView from './EmptyView.tsx';

export default class TextView extends Component {
  render() {
    if (this.props.content)
      return (
        <Container>
          {this.props.content}
        </Container>
      );
    else return <EmptyView />;
  }
}
