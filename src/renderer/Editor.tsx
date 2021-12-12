import { Component } from 'react'
import { Button, Form, Header, Input, Label, Menu, Modal, Segment, Table, TextArea } from 'semantic-ui-react';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'Comments' };
  }

  get = (propertyName, fallbackName) => {
    if (this.props.openEntry !== null) {
      const propertyValue = this.props.openEntry[propertyName]
      if (fallbackName !== null && propertyValue === null)
        return this.props.openEntry[fallbackName]
      else
        return propertyValue
    } else return ''
  }

  handleTabClick = (event, target) => {
    this.setState({ activeTab: target.name });
  }

  handleFieldChange = (propertyName) => {
    return (event, target) => {
      this.props.openEntry[propertyName] = target.value
    }
  }

  renderInputField = (propertyName) => {
    return (
      <Table.Row>
        <Table.Cell collapsing>{propertyName}</Table.Cell>
        <Table.Cell>
          <Input
            fluid
            type='text'
            defaultValue={this.get(propertyName)}
            onChange={this.handleFieldChange(propertyName)}
          />
        </Table.Cell>
      </Table.Row>
    )
  }

  renderActiveTab = () => {
    if (this.state.activeTab === 'Comments')
      return (
        <Form>
          <TextArea
            placeholder='What are your thoughts about this reference?'
            style={{ minHeight: 'calc(33vh - 30px)' }}
            defaultValue={this.get('comment')}
            onChange={this.handleFieldChange('comment')}
          />
        </Form>
      )
    else if (this.state.activeTab === 'Fields')
      return (
        <Form>
          <Table basic='very'>
            <Table.Body>
              {this.renderInputField('title')}
              {this.renderInputField('author')}
              {this.renderInputField('booktitle')}
            </Table.Body>
          </Table>
        </Form>
      )
    else if (this.state.activeTab === 'BibTeX')
      return (
        <Form>
          <TextArea
            style={{ minHeight: 'calc(33vh - 30px)' }}
            defaultValue='TODO: export BibTeX'
          />
        </Form>
      )
  }

  render() {
    return (
      <Modal open={this.props.openEntry !== null} onClose={this.props.onClose}>
        <Modal.Content>

          <Menu attached='top' tabular>
            <Menu.Item
              name='Comments'
              active={this.state.activeTab === 'Comments'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name='Fields'
              active={this.state.activeTab === 'Fields'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name='BibTeX'
              active={this.state.activeTab === 'BibTeX'}
              onClick={this.handleTabClick}
            />
            <Menu.Menu position='right'>
              <Menu.Item>
                <Header size='tiny'>{this.get('bibKey')}</Header>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Segment attached='bottom' style={{ minHeight: '33vh' }}>
            {this.renderActiveTab()}
          </Segment>

        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose}>Done</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
