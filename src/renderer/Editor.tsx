import { Component } from 'react'
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Header,
  Input,
  Menu,
  Modal,
  Segment,
  Table,
  TextArea
} from 'semantic-ui-react';

const REQUIRED_FIELDS = { // https://tex.stackexchange.com/a/239046/223178
  article: ['author', 'title', 'journal', 'year'],
  book: ['author', 'editor', 'title', 'publisher', 'year'], // author OR editor
  incollection: ['author', 'title', 'booktitle', 'publisher', 'year'],
  inproceedings: ['author', 'title', 'booktitle', 'year'],
  manual: ['title'],
  mastersthesis: ['author', 'title', 'school', 'year'],
  phdthesis: ['author', 'title', 'school', 'year'],
  techreport: ['author', 'title', 'institution', 'year'],
  unpublished: ['author', 'title', 'note'],
}

const OPTIONAL_FIELDS = {
  article: ['volume', 'number', 'pages', 'month', 'note'],
  book: ['volume', 'number', 'series', 'address', 'edition', 'month', 'note'], // volume OR number
  incollection: ['editor', 'volume', 'number', 'series', 'type', 'chapter', 'pages', 'address', 'edition', 'month', 'note'], // volume OR number
  inproceedings: ['editor', 'volume', 'number', 'series', 'pages', 'address', 'month', 'organization', 'publisher', 'note'], // volume OR number
  manual: ['author', 'organization', 'address', 'edition', 'month', 'year', 'note'],
  mastersthesis: ['type', 'address', 'month', 'note'],
  misc: ['author', 'title', 'howpublished', 'month', 'year', 'note'],
  phdthesis: ['type', 'address', 'month', 'note'],
  techreport: ['type', 'number', 'address', 'month', 'note'],
  unpublished: ['month', 'year'],
}

const ENTRY_TYPES = Object.keys(OPTIONAL_FIELDS).map((key) => ({
  key: key.toLowerCase(),
  text: key.toLowerCase(),
  value: key.toLowerCase()
})) // options of an entryType Dropdown

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'Comments' };
  }

  get = (fieldName, fallbackName) => {
    if (this.props.openEntry !== null) {
      const propertyValue = this.props.openEntry[fieldName]
      if (fallbackName !== null && propertyValue === null)
        return this.props.openEntry[fallbackName]
      else
        return propertyValue
    } else return ''
  }

  handleTabClick = (event, target) => {
    this.setState({ activeTab: target.name });
  }

  handleFieldChange = (fieldName) => {
    return (event, target) => {
      this.props.openEntry[fieldName] = target.value
    }
  }

  renderInputField = (fieldName) => {
    return (
      <Table.Row key={fieldName}>
        <Table.Cell collapsing>{fieldName}</Table.Cell>
        <Table.Cell>
          <Input
            fluid
            type='text'
            defaultValue={this.get(fieldName)}
            onChange={this.handleFieldChange(fieldName)}
          />
        </Table.Cell>
      </Table.Row>
    )
  }

  renderActiveTab = () => {
    if (this.props.openEntry !== null) {
      if (this.state.activeTab === 'Comments') {
        return (
          <Form>
            <TextArea
              placeholder='What are your thoughts about this reference?'
              style={{ minHeight: 'calc(45vh - 30px)' }}
              defaultValue={this.get('comment')}
              onChange={this.handleFieldChange('comment')}
            />
          </Form>
        )
      } else if (this.state.activeTab === 'Required fields') {
        const entryType = this.props.openEntry.entryType.toLowerCase()
        const fields = REQUIRED_FIELDS[entryType].map(this.renderInputField)
        return (
          <Form>
            <Table basic='very'>
              <Table.Body>
                {fields}
              </Table.Body>
            </Table>
          </Form>
        )
      } else if (this.state.activeTab === 'Optional fields') {
        const entryType = this.props.openEntry.entryType.toLowerCase()
        const fields = OPTIONAL_FIELDS[entryType].map(this.renderInputField)
        return (
          <Form>
            <Table basic='very'>
              <Table.Body>
                {fields}
              </Table.Body>
            </Table>
          </Form>
        )
      } else if (this.state.activeTab === 'Links') {
        return (
          <Form>
            <Table basic='very'>
              <Table.Body>
                {this.renderInputField('doi')}
                {this.renderInputField('url')}
              </Table.Body>
            </Table>
          </Form>
        )
      } else if (this.state.activeTab === 'BibTeX') {
        return (
          <Form>
            <TextArea
              style={{ minHeight: 'calc(45vh - 30px)' }}
              defaultValue='TODO: export BibTeX'
            />
          </Form>
        )
      }
    }
  }

  render() {
    return (
      <Modal open={this.props.openEntry !== null} onClose={this.props.onClose}>
        <Modal.Content>
          <Header>
            {this.get('bibKey')}
            <Header.Subheader>{this.get('title')}</Header.Subheader>
          </Header>
          <Dropdown
            inline
            options={ENTRY_TYPES}
            defaultValue={this.get('entryType').toLowerCase()}
            onChange={this.handleFieldChange('entryType')}
          />

          <Menu attached='top' tabular>
            <Menu.Item
              name='Comments'
              active={this.state.activeTab === 'Comments'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name='Required fields'
              active={this.state.activeTab === 'Required fields'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name='Optional fields'
              active={this.state.activeTab === 'Optional fields'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name='Links'
              active={this.state.activeTab === 'Links'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name='BibTeX'
              active={this.state.activeTab === 'BibTeX'}
              onClick={this.handleTabClick}
            />
          </Menu>
          <Segment attached='bottom' style={{ minHeight: '45vh' }}>
            {this.renderActiveTab()}
          </Segment>

        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose}>Done (Esc)</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
