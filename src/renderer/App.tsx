import { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import MenuBar from './MenuBar.tsx';
import ToolBar from './ToolBar.tsx';
import TextView from './TextView.tsx';
import '../../node_modules/semantic-ui-css/semantic.min.css';
import './App.css';
import fs from 'fs';

class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { path: '', content: '' };
  }

  handleNew = () => {
    this.setState({ path: '', content: '' });
  }

  handleOpen = (path) => {
    fs.readFile(
      path,
      'utf-8',
      (err, data) => {
        if (err) throw err;

        // trigger an update of this component
        this.setState({ path, content: data.toString() });
      }
    );
  }

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
          <TextView content={this.state.content}/>
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
