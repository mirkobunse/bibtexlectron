import { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import MenuBar from './MenuBar.tsx';
import ToolBar from './ToolBar.tsx';
import TableView from './TableView.tsx';
import '../../node_modules/semantic-ui-css/semantic.min.css';
import './App.css';

const AppLayout = () => (
  <Grid padded className='layout-grid'>
    <Grid.Row>
      <Grid.Column>
        <MenuBar />
      </Grid.Column>
    </Grid.Row>

    <Grid.Row>
    <Grid.Column>
      <ToolBar />
    </Grid.Column>
    </Grid.Row>

    <Grid.Row className='main-row'>
    <Grid.Column className='main-col'>
      <TableView />
    </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AppLayout} />
      </Switch>
    </Router>
  );
}
