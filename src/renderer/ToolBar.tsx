import { Component } from 'react'
import { Button, Container, Dropdown, Icon, Input } from 'semantic-ui-react';

const languageOptions = [
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
      <Container fluid style={{ height: '60px' }}>
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
        <Input
          icon='search'
          iconPosition='left'
          placeholder='Search...'
          style={{ marginTop: '4px', marginBottom: '5px', marginLeft: '8px', width: 'calc(100% - 300px)' }}
        />
      </Container>
    )
  }
}
