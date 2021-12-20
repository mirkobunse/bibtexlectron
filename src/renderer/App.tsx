import { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import parseBibtex from './io/parseBibtex';
import MenuBar from './MenuBar.tsx';
import ToolBar from './ToolBar.tsx';
import TableView from './view/TableView.tsx';
import Editor from './Editor.tsx';
import '../../node_modules/semantic-ui-css/semantic.min.css';
import './App.css';

const DEFAULT_STATE = {
  path: null,
  textContent: null,
  entries: null,
  searchFilter: null,
  openEntry: null
}

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  handleNew = () => {
    this.setState(DEFAULT_STATE);
  }

  handleOpen = () => {
    window.electron.ipcRenderer.invoke('open', {
      title: 'Open a file'
    }).then(result => {
      console.log(result)
      if (!result.canceled) {
        const textContent = result.data.toString();
        const entries = parseBibtex(textContent);
        console.log(entries);

        // trigger an update of this component
        this.setState({ path: result.path, textContent, entries });
      }
    }).catch(error => {
      console.log(error)
    })
  }

  handleSearch = (filter) => {
    this.setState({ searchFilter: filter })
  }

  handleEntryClicked = (entry) => {
    this.setState({ openEntry: entry });
  }

  handleLinkClicked = (entry) => {
    if (entry.url !== undefined) {
      electron.shell.openExternal(entry.url)
    } else if (entry.doi !== undefined) {
      console.log(entry.doi) // TODO
    }
  }

  // handleParsed = (path, textContent) => {
  //   return (data) => {
  //     this.setState({ // trigger an update of this component
  //       path,
  //       textContent,
  //       entries: cite.set(data).get()
  //     });
  //   }
  // }

  handleEditorClose = () => {
    this.setState({ openEntry: null });
  }

  // componentDidMount() {
  //   if (this.path) // open the default file on startup
  //     this.handleOpen(this.state.path);
  // }

  render() {
    return (
      <Grid padded className='layout-grid'>
        <Editor openEntry={this.state.openEntry} onClose={this.handleEditorClose} />
        <Grid.Row>
          <Grid.Column>
            <MenuBar
              path={this.state.path}
              onOpen={this.handleOpen}
              onNew={this.handleNew}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
        <Grid.Column>
          <ToolBar
            onSearch={this.handleSearch}
          />
        </Grid.Column>
        </Grid.Row>

        <Grid.Row className='main-row'>
        <Grid.Column className='main-col'>
          <TableView
            entries={this.state.entries}
            searchFilter={this.state.searchFilter}
            onEntryClicked={this.handleEntryClicked}
            onLinkClicked={this.handleLinkClicked}
          />
        </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AppComponent} />
      </Switch>
    </Router>
  );
}
