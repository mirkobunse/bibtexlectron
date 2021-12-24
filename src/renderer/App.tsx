import { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Entry } from './io/ast';
import parseBibtex from './io/parseBibtex';
import MenuBar from './MenuBar';
import ToolBar from './ToolBar';
import TableView from './view/TableView';
import Editor from './Editor';
import '../../node_modules/semantic-ui-css/semantic.min.css';
import './App.css';

// type information about window.electron, see src/main/preload.js
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void,
        once: (channel: string, func: (...args: any[]) => void) => void,
        invoke: (channel: string, ...args: any[]) => Promise<any>
      },
      store: {
        get: (key: string) => any,
        set: (key: string, val: any) => void
      },
      openExternal: (url: string) => void
    },
  }
}

// type information about properties and state of the AppComponent
type AppProps = {} // empty type; the AppComponent has no props
type AppState = {
  path?: string,
  entries?: Entry[],
  searchFilter?: string,
  openEntry?: Entry
}

class AppComponent extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {};
  }

  // reset all state when File->New is clicked
  handleNewFile = () => {
    window.electron.store.set("path", undefined);
    this.setState({
      path: undefined,
      entries: undefined,
      searchFilter: undefined,
      openEntry: undefined
    });
  }

  // show an opening dialog and retrieve the text content of the selected file
  handleOpenFile = () => {
    window.electron.ipcRenderer.invoke('open-file', {
      title: 'Open a file'
    }).then(result => {
      if (result.data) {
        window.electron.store.set("path", result.path);
        this.setState({ // set the state according to the file contents
          path: result.path,
          entries: parseBibtex(result.data)
        });
      }
    }).catch(console.log)
  }

  handleSearch = (filter?: string) => {
    this.setState({ searchFilter: filter })
  }

  handleEntryClicked = (entry: Entry) => {
    this.setState({ openEntry: entry });
  }

  // open full-text in browser when the file icon of an entry is clicked
  handleLinkClicked = (entry: Entry) => {
    if (entry.url)
      window.electron.openExternal(entry.url)
    else if (entry.doi !== undefined)
      console.log("TODO: openExternal from DOI")
    else
      console.log(entry.bibKey + " has neither a URL nor a DOI")
  }

  handleEditorClose = () => {
    this.setState({ openEntry: undefined });
  }

  // open the last file on startup
  componentDidMount = () => {
    const path = window.electron.store.get("path");
    if (path) { // open the default file on startup
      window.electron.ipcRenderer.invoke('read-file', path)
        .then(result => {
          if (result.data) {
            this.setState({ // set the state according to the file contents
              path: result.path,
              entries: parseBibtex(result.data)
            });
          }
        }).catch(console.log)
    }
  }

  render() {
    return (
      <Grid padded className='layout-grid'>
        <Editor openEntry={this.state.openEntry} onClose={this.handleEditorClose} />
        <Grid.Row>
          <Grid.Column>
            <MenuBar
              path={this.state.path}
              onOpenFile={this.handleOpenFile}
              onNewFile={this.handleNewFile}
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

// routing
export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AppComponent} />
      </Switch>
    </Router>
  );
}
