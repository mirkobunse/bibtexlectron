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
      openExternal: (url: string) => void
    },
  }
}

type AppProps = {} // empty type; the AppComponent has no props
type AppState = {
  path?: string,
  textContent?: string,
  entries?: Entry[],
  searchFilter?: string,
  openEntry?: Entry
}

const DEFAULT_STATE = {
  path: undefined,
  textContent: undefined,
  entries: undefined,
  searchFilter: undefined,
  openEntry: undefined
}

class AppComponent extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  handleNewFile = () => {
    this.setState(DEFAULT_STATE);
  }

  handleOpenFile = () => {
    window.electron.ipcRenderer.invoke('open-file', {
      title: 'Open a file'
    }).then(result => {
      console.log(result)
      if (result.data) {
        const textContent = result.data;
        const entries = parseBibtex(textContent);
        console.log(entries);

        // trigger an update of this component
        this.setState({ path: result.path, textContent, entries });
      }
    }).catch(error => {
      console.log(error)
    })
  }

  handleSearch = (filter?: string) => {
    this.setState({ searchFilter: filter })
  }

  handleEntryClicked = (entry: Entry) => {
    this.setState({ openEntry: entry });
  }

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

  // componentDidMount() {
  //   if (this.path) // open the default file on startup
  //     this.handleOpenFile(this.state.path);
  // }

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

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AppComponent} />
      </Switch>
    </Router>
  );
}
