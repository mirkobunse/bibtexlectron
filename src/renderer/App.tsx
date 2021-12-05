import { Component } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import MenuBar from './MenuBar.tsx';
import ToolBar from './ToolBar.tsx';
import TableView from './TableView.tsx';
import '../../node_modules/semantic-ui-css/semantic.min.css';
import './App.css';

const AppLayout = () => (
  <Grid padded>
    <Grid.Row style={{ padding: '0px' }}>
      <Grid.Column style={{ padding: '0px' }}>
        <MenuBar />
      </Grid.Column>
    </Grid.Row>

    <Grid.Row style={{ paddingTop: '0px', paddingBottom: '0px', background: '#1b1c1d' }}>
    <Grid.Column>
      <ToolBar />
    </Grid.Column>
    </Grid.Row>

    <Grid.Row style={{ padding: '0px', height: 'calc(100vh - 100px)' }}>
    <Grid.Column style={{ padding: '0px', width: '100vw', overflowY: 'scroll' }}>
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
