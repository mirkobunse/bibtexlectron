import { Component, MouseEvent } from 'react';
import {
  Button,
  ButtonProps,
  Dropdown,
  Form,
  Header,
  Input,
  Menu,
  MenuItemProps,
  Modal,
  ModalProps,
  Segment,
  Table,
  TextArea,
} from 'semantic-ui-react';
import { Entry } from './io/ast';
import renderBibtex from './io/renderBibtex';

/*
 * You find the optional and required fields of BibTeX at
 * https://tex.stackexchange.com/a/239046/223178
 */
const REQUIRED_FIELDS: { [type: string]: string[] } = {
  article: ['author', 'title', 'journal', 'year'],
  book: ['author', 'editor', 'title', 'publisher', 'year'], // author OR editor
  incollection: ['author', 'title', 'booktitle', 'publisher', 'year'],
  inproceedings: ['author', 'title', 'booktitle', 'year'],
  manual: ['title'],
  mastersthesis: ['author', 'title', 'school', 'year'],
  phdthesis: ['author', 'title', 'school', 'year'],
  techreport: ['author', 'title', 'institution', 'year'],
  unpublished: ['author', 'title', 'note'],
};

const OPTIONAL_FIELDS: { [type: string]: string[] } = {
  article: ['volume', 'number', 'pages', 'month', 'note'],
  book: ['volume', 'number', 'series', 'address', 'edition', 'month', 'note'], // volume OR number
  incollection: [
    'editor',
    'volume',
    'number',
    'series',
    'type',
    'chapter',
    'pages',
    'address',
    'edition',
    'month',
    'note',
  ], // volume OR number
  inproceedings: [
    'editor',
    'volume',
    'number',
    'series',
    'pages',
    'address',
    'month',
    'organization',
    'publisher',
    'note',
  ], // volume OR number
  manual: [
    'author',
    'organization',
    'address',
    'edition',
    'month',
    'year',
    'note',
  ],
  mastersthesis: ['type', 'address', 'month', 'note'],
  misc: ['author', 'title', 'howpublished', 'month', 'year', 'note'],
  phdthesis: ['type', 'address', 'month', 'note'],
  techreport: ['type', 'number', 'address', 'month', 'note'],
  unpublished: ['month', 'year'],
};

const ENTRY_TYPES = Object.keys(OPTIONAL_FIELDS).map((key) => ({
  key: key.toLowerCase(),
  text: key.toLowerCase(),
  value: key.toLowerCase(),
})); // options of an entryType Dropdown

type EditorProps = {
  openEntry?: Entry;
  onClose?: (
    event: MouseEvent<HTMLElement>,
    data: ButtonProps | ModalProps
  ) => void;
};
type EditorState = {
  activeTab: string;
};

export default class Editor extends Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);
    this.state = { activeTab: 'Comments' };
  }

  get = (fieldName: string, fallbackName?: string) => {
    if (this.props.openEntry !== undefined) {
      const propertyValue = this.props.openEntry[fieldName];
      if (fallbackName !== undefined && propertyValue === undefined)
        return this.props.openEntry[fallbackName];
      return propertyValue;
    }
    return '';
  };

  handleTabClick = (_: any, target: MenuItemProps) => {
    if (target.name !== undefined) this.setState({ activeTab: target.name });
  };

  handleFieldChange = (fieldName: string) => {
    return (_: any, target: any) => {
      if (this.props.openEntry !== undefined)
        if (target.value !== undefined)
          this.props.openEntry[fieldName] = target.value;
    };
  };

  renderInputField = (fieldName: string) => {
    return (
      <Table.Row key={fieldName}>
        <Table.Cell collapsing>{fieldName}</Table.Cell>
        <Table.Cell>
          <Input
            fluid
            type="text"
            defaultValue={this.get(fieldName)}
            onChange={this.handleFieldChange(fieldName)}
          />
        </Table.Cell>
      </Table.Row>
    );
  };

  renderBibtexEntry = () => {
    if (this.props.openEntry !== undefined)
      return renderBibtex(this.props.openEntry);
    return '';
  };

  renderActiveTab = () => {
    if (this.props.openEntry !== undefined) {
      if (this.state.activeTab === 'Comments') {
        return (
          <Form>
            <TextArea
              placeholder="What are your thoughts about this reference?"
              style={{ minHeight: 'calc(45vh - 30px)' }}
              value={this.get('comment')}
              onChange={this.handleFieldChange('comment')}
            />
          </Form>
        );
      }
      if (this.state.activeTab === 'Required fields') {
        const entryType = this.props.openEntry.entryType.toLowerCase();
        const fields = REQUIRED_FIELDS[entryType].map(this.renderInputField);
        return (
          <Form>
            <Table basic="very">
              <Table.Body>{fields}</Table.Body>
            </Table>
          </Form>
        );
      }
      if (this.state.activeTab === 'Optional fields') {
        const entryType = this.props.openEntry.entryType.toLowerCase();
        const fields = OPTIONAL_FIELDS[entryType].map(this.renderInputField);
        return (
          <Form>
            <Table basic="very">
              <Table.Body>{fields}</Table.Body>
            </Table>
          </Form>
        );
      }
      if (this.state.activeTab === 'Links') {
        return (
          <Form>
            <Table basic="very">
              <Table.Body>
                {this.renderInputField('doi')}
                {this.renderInputField('url')}
              </Table.Body>
            </Table>
          </Form>
        );
      }
      if (this.state.activeTab === 'BibTeX') {
        return (
          <Form>
            <TextArea
              style={{
                minHeight: 'calc(45vh - 30px)',
                fontFamily: 'monospace',
              }}
              value={this.renderBibtexEntry()}
            />
          </Form>
        );
      }
      console.log('ERROR: illegal activeTab =', this.state.activeTab);
      return <Form />;
    }
    return <Form />;
  };

  render() {
    return (
      <Modal
        open={this.props.openEntry !== undefined}
        onClose={this.props.onClose}
      >
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

          <Menu attached="top" tabular>
            <Menu.Item
              name="Comments"
              active={this.state.activeTab === 'Comments'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="Required fields"
              active={this.state.activeTab === 'Required fields'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="Optional fields"
              active={this.state.activeTab === 'Optional fields'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="Links"
              active={this.state.activeTab === 'Links'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="BibTeX"
              active={this.state.activeTab === 'BibTeX'}
              onClick={this.handleTabClick}
            />
          </Menu>
          <Segment attached="bottom" style={{ minHeight: '45vh' }}>
            {this.renderActiveTab()}
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose}>Done (Esc)</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
