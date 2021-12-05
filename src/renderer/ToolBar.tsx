import { Component } from 'react'
import { Button, Container, Dropdown, Icon, Input } from 'semantic-ui-react';

const filterOptions = [
  { key: 'Arabic', text: 'Arabic', value: 'Arabic' },
  { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
  { key: 'Danish', text: 'Danish', value: 'Danish' },
  { key: 'Dutch', text: 'Dutch', value: 'Dutch' },
  { key: 'English', text: 'English', value: 'English' },
  { key: 'French', text: 'French', value: 'French' },
]

export default class ToolBar extends Component {
  render() {
    return (
      <Container fluid className='tool-bar'>
        <Button icon labelPosition='left' className='add'>
          <Icon name='plus' />
          Add...
        </Button>
        <Dropdown
          button
          floating
          className='icon'
          labeled
          icon='filter'
          options={filterOptions}
          search
          text='Filter by Tag...'
        />
        <Input
          icon='search'
          iconPosition='left'
          placeholder='Search...'
        />
      </Container>
    )
  }
}
