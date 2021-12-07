import React, { Component } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

export default class MenuBar extends Component {
  private readonly openRef : RefObject<HTMLInputElement>

  constructor(props) {
    super(props);
    this.openRef = React.createRef();
  }

  showFileDialog = () => {
    this.openRef.current.click();
  }

  handleNew = (event) => {
    this.openRef.current.value = "";
    this.props.onNew();
  }

  handleOpen = (event) => {
    this.props.onOpen(event.target.files[0].path);
  }

  render() {
    return (
      <Menu inverted fluid className='menu-bar'>
        <Dropdown item icon={null} text='File'>
          <Dropdown.Menu>
            <Dropdown.Item
              text='New'
              description='ctrl + n'
              onClick={this.handleNew}
            />
            <Dropdown.Item onClick={this.showFileDialog}>
              <input
                ref={this.openRef}
                type="file"
                style={{ display: "none" }}
                onChange={this.handleOpen}
              />
              <span className='text'>Open...</span>
              <span className='description'>ctrl + o</span>
            </Dropdown.Item>
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
          {this.props.path}
        </Menu.Item>
        <Menu.Item header position='right'>
          bibtexlectron
        </Menu.Item>
      </Menu>
    )
  }
}
