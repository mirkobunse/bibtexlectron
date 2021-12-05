import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Button, Confirm, Container, Dropdown, Grid, Icon, Input, Menu, Table } from 'semantic-ui-react';
import '../../node_modules/semantic-ui-css/semantic.min.css';
import './App.css';

const languageOptions = [
  { key: 'Arabic', text: 'Arabic', value: 'Arabic' },
  { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
  { key: 'Danish', text: 'Danish', value: 'Danish' },
  { key: 'Dutch', text: 'Dutch', value: 'Dutch' },
  { key: 'English', text: 'English', value: 'English' },
  { key: 'French', text: 'French', value: 'French' },
]

const MenuExampleAttached = () => (
  <Grid padded>
    <Grid.Row style={{ padding: '0px', height: '40px' }}>
    <Grid.Column style={{ padding: '0px' }}>
    <Menu inverted fixed='top'>
      <Dropdown item icon={null} text='File'>
        <Dropdown.Menu style={{ minWidth: '14em' }}>
          <Dropdown.Item text='New' description='ctrl + n' />
          <Dropdown.Item text='Open...' description='ctrl + o' />
          <Dropdown.Item text='Save' description='ctrl + s' />
          <Dropdown.Item text='Save as...' description='ctrl + shift + s' />
          <Dropdown.Item text='Close' />
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown item icon={null} text='Edit'>
        <Dropdown.Menu style={{ minWidth: '14em' }}>
          <Dropdown.Item text='New' description='ctrl + n' />
          <Dropdown.Item text='Open...' description='ctrl + o' />
          <Dropdown.Item text='Save' description='ctrl + s' />
          <Dropdown.Item text='Save as...' description='ctrl + shift + s' />
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Item header position='right'>
        Ö
      </Menu.Item>
    </Menu>
    </Grid.Column>
    </Grid.Row>

    <Grid.Row style={{ paddingTop: '0px', paddingBottom: '0px', background: '#1b1c1d', height: '60px' }}>
    <Grid.Column>
    <Button icon labelPosition='left' style={{ marginTop: '6px', marginBottom: '6px' }}>
      <Icon name='plus' />
      Add...
    </Button>
    <Dropdown
      button
      floating
      className='icon'
      labeled
      icon='filter'
      options={languageOptions}
      search
      text='Filter by Tag...'
      style={{ marginTop: '6px', marginBottom: '6px', marginLeft: '8px' }}
    />
    <Input icon='search' iconPosition='left' placeholder='Search...' style={{ marginTop: '4px', marginBottom: '5px', marginLeft: '8px', width: 'calc(100% - 300px)' }} />
    </Grid.Column>
    </Grid.Row>

    <Grid.Row style={{ padding: '0px', height: 'calc(100vh - 100px)' }}>
    <Grid.Column style={{ padding: '0px', width: '100vw', overflowY: 'scroll' }}>
    <Table striped compact selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Date Joined</Table.HeaderCell>
          <Table.HeaderCell>E-mail</Table.HeaderCell>
          <Table.HeaderCell>Called</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>John Lilki</Table.Cell>
          <Table.Cell>September 14, 2013</Table.Cell>
          <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
          <Table.Cell>No</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jamie Harington</Table.Cell>
          <Table.Cell>January 11, 2014</Table.Cell>
          <Table.Cell>jamieharingonton@yahoo.com</Table.Cell>
          <Table.Cell>Yes</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Jill Lewis</Table.Cell>
          <Table.Cell>May 11, 2014</Table.Cell>
          <Table.Cell>jilsewris22@yahoo.com</Table.Cell>
          <Table.Cell>Yes</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
    </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={MenuExampleAttached} />
      </Switch>
    </Router>
  );
}
