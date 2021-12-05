import { Component } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

export default class MenuBar extends Component {
  render() {
    return (
      <Menu inverted fluid style={{ height: '40px' }}>
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
    )
  }
}
