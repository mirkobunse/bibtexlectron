import { Component } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

export default class MenuBar extends Component {
  render() {
    return (
      <Menu inverted fluid className='menu-bar'>
        <Dropdown item icon={null} text='File'>
          <Dropdown.Menu>
            <Dropdown.Item text='New' description='ctrl + n' />
            <Dropdown.Item text='Open...' description='ctrl + o' />
            <Dropdown.Item text='Save' description='ctrl + s' />
            <Dropdown.Item text='Save as...' description='ctrl + shift + s' />
            <Dropdown.Item text='Close' />
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item icon={null} text='Edit'>
          <Dropdown.Menu>
            <Dropdown.Item text='New' description='ctrl + n' />
            <Dropdown.Item text='Open...' description='ctrl + o' />
            <Dropdown.Item text='Save' description='ctrl + s' />
            <Dropdown.Item text='Save as...' description='ctrl + shift + s' />
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item position='right' className='file-name'>
          ~/foo/bar.tex
        </Menu.Item>
        <Menu.Item header position='right'>
          bibtexlectron
        </Menu.Item>
      </Menu>
    )
  }
}
