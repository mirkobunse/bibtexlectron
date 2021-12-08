import { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import parseBibtex from './io/parseBibtex';
import MenuBar from './MenuBar.tsx';
import ToolBar from './ToolBar.tsx';
import TableView from './view/TableView.tsx';
import '../../node_modules/semantic-ui-css/semantic.min.css';
import './App.css';
import fs from 'fs';

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { path: null, textContent: null, entries: null };
  }

  handleNew = () => {
    this.setState({ path: null, textContent: null, entries: null });
  }

  handleOpen = (path) => {
    fs.readFile(
      path,
      'utf-8',
      (err, data) => { // parse the BibTeX file
        if (err) throw err;
        const textContent = data.toString();
        const entries = parseBibtex(textContent);
        console.log(entries);

        // trigger an update of this component
        this.setState({ path, textContent, entries });

        // parseAsync(textContent)
        //   .then(this.handleParsed(path, textContent));
      }
    );
  }

  handleEntryClicked = (entry) => {
    console.log(entry)
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

  componentDidMount() {
    if (this.path) // open the default file on startup
      this.handleOpen(this.state.path);
  }

  render() {
    return (
      <Grid padded className='layout-grid'>
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
          <ToolBar />
        </Grid.Column>
        </Grid.Row>

        <Grid.Row className='main-row'>
        <Grid.Column className='main-col'>
          <TableView entries={this.state.entries} onEntryClicked={this.handleEntryClicked}/>
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
