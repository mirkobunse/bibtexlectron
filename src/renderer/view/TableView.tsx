import { Component } from 'react';
import { Table } from 'semantic-ui-react';
import EmptyView from './EmptyView.tsx';

class TableRow extends Component {
  render() {
    const c = this.props.content; // shorthand
    return (
      <Table.Row>
        <Table.Cell>{c['id']}</Table.Cell>
        <Table.Cell>{c['title'] || ''}</Table.Cell>
        <Table.Cell>{c['container-title'] || ''}</Table.Cell>
        <Table.Cell>{c['issued']['date-parts'][0] || ''}</Table.Cell>
      </Table.Row>
    )
  }
}

export default class TableView extends Component {
  renderRows = () => {
    return this.props.content.map((entry) => <TableRow content={entry} key={entry['id']}/>);
  }

  render() {
    if (this.props.content)
      return (
        <Table striped compact selectable className="table-view">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Booktitle</Table.HeaderCell>
              <Table.HeaderCell>Year</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderRows()}
          </Table.Body>
        </Table>
      );
    else return <EmptyView />;
  }
}
