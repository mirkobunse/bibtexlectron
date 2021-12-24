import _ from 'lodash';
import { Component } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import EmptyView from './EmptyView';
import { Entry } from '../io/ast';

type TableViewProps = {
  entries?: Entry[],
  searchFilter?: string,
  onLinkClicked: (entry: Entry) => void,
  onEntryClicked: (entry: Entry) => void
}
type TableViewState = {
  sortColumn: string,
  sortAscending: boolean,
  selectedKey?: string,
}

export default class TableView extends Component<TableViewProps, TableViewState> {
  constructor(props: TableViewProps) {
    super(props);
    this.state = { // sort by descending year
      sortColumn: 'year',
      sortAscending: false,
      selectedKey: undefined
    }
  }

  renderEntries = () => {
    const entries = _.filter( // filter entries by the search bar
      this.props.entries,
      (entry: Entry) => {
        if (this.props.searchFilter) {
          for (const value of Object.values(entry)) {
            if (value.includes(this.props.searchFilter))
              return true
          }
          return false
        } else return true
      }
    )
    return _.orderBy( // order entries by the selected column
      entries,
      this.state.sortColumn,
      this.state.sortAscending ? 'asc' : 'desc'
    ).map((entry: Entry) => ( // render all remaining, sorted entries
      <Table.Row
        key={entry.bibKey}
        onClick={this.handleEntryClicked(entry.bibKey)}
        active={entry.bibKey === this.state.selectedKey}
      >
        <Table.Cell collapsing>
          <Icon
            name='file text'
            link
            fitted
            disabled={entry.url === undefined && entry.doi === undefined}
          />
        </Table.Cell>
        <Table.Cell collapsing>{entry.bibKey}</Table.Cell>
        <Table.Cell>{entry.author || entry.editor || ''}</Table.Cell>
        <Table.Cell>{entry.title || ''}</Table.Cell>
        <Table.Cell>{entry.journal || entry.booktitle || ''}</Table.Cell>
        <Table.Cell collapsing>{entry.year || ''}</Table.Cell>
      </Table.Row>
    ))
  }

  handleSort = (column: string) => {
    return () => {
      if (this.state.sortColumn === column) // change direction
        this.setState({ sortAscending: !this.state.sortAscending })
      else // change column
        this.setState({ sortColumn: column, sortAscending: true })
    }
  }

  isSorted = (column: string) => {
    if (this.state.sortColumn === column) {
      return this.state.sortAscending ? 'ascending' : 'descending'
    } else return undefined
  }

  handleEntryClicked = (bibKey: string) => {
    return (event: any) => {
      const entry = _.find(this.props.entries, (entry: Entry) => {
        return entry.bibKey === bibKey
      })
      if (event.target.localName === 'i') { // file icon clicked
        this.props.onLinkClicked(entry)
      } else { // something else in the row has been clicked
        this.props.onEntryClicked(entry)
        this.setState({ selectedKey: bibKey })
      }
    }
  }

  render() {
    if (this.props.entries) {
      return (
        <Table sortable striped compact selectable className="table-view">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing/>
              <Table.HeaderCell
                sorted={this.isSorted('bibKey')}
                onClick={this.handleSort('bibKey')}
                collapsing
              >
                ID
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={this.isSorted('author')}
                onClick={this.handleSort('author')}
              >
                Authors / Editors
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={this.isSorted('title')}
                onClick={this.handleSort('title')}
              >
                Title
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={this.isSorted('journal')}
                onClick={this.handleSort('journal')}
              >
                Journal / Booktitle
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={this.isSorted('year')}
                onClick={this.handleSort('year')}
                collapsing
              >
                Year
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderEntries()}
          </Table.Body>
        </Table>
      );
    } else return <EmptyView />;
  }
}
