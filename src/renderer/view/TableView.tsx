import { Component } from 'react';
import { Table } from 'semantic-ui-react';
import EmptyView from './EmptyView.tsx';

class TableRow extends Component {
  render() {
    const entry = this.props.entry;
    return (
      <Table.Row>
        <Table.Cell>{entry.bibKey}</Table.Cell>
        <Table.Cell>{entry.author || entry.editor || ''}</Table.Cell>
        <Table.Cell>{entry.title || ''}</Table.Cell>
        <Table.Cell>{entry.journal || entry.booktitle || ''}</Table.Cell>
        <Table.Cell>{entry.year || ''}</Table.Cell>
      </Table.Row>
    )
  }
}

export default class TableView extends Component {
  renderEntries = () => {
    return this.props.entries.map((entry) => <TableRow entry={entry} key={entry.bibKey}/>);
  }

  render() {
    if (this.props.entries)
      return (
        <Table striped compact selectable className="table-view">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Authors / Editor</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Journal / Booktitle</Table.HeaderCell>
              <Table.HeaderCell>Year</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderEntries()}
          </Table.Body>
        </Table>
      );
    else return <EmptyView />;
  }
}
