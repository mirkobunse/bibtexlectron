import { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react';

export default class Editor extends Component {
  get = (propertyName, fallbackName) => {
    if (this.props.openEntry !== null) {
      const propertyValue = this.props.openEntry[propertyName]
      if (fallbackName !== null && propertyValue === null)
        return this.props.openEntry[fallbackName]
      else
        return propertyValue
    } else return ''
  }
  render() {
    return (
      <Modal open={this.props.openEntry !== null}>
        <Modal.Header>{this.get('bibKey')}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>{this.get('author', 'editor')}</p>
            <p>{this.get('title')}</p>
            <p>{this.get('journal', 'booktitle')}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose}>Done</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
