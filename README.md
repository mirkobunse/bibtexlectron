# A minimalistic electron-based BibTeX manager

bibtexlectron is based on the [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) and on [Semantic UI](https://react.semantic-ui.com/) components.


## Install

Install all dependencies through the Node.js package manager. Moreover, the current version of Semantic UI requires a double semi-colon to be replaced with a single one.

```
npm install
sed -i "s/;;/;/g" node_modules/semantic-ui-css/semantic.min.css
```


## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```


## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```


## Learning React: typical fallacies

In addition to BibTeX management, bibtexlectron is intended to serve as a learning platform for React developers. Following this intention, we address some of the typical fallacies that might occur to React newcomers.

### State-full Components

The state of a Component is always stored in `this.state`. Members of this variable, like `this.state.value` in the example below, can be read from anywhere inside the component. A change of the state, however, is only possible through an invocation of `this.setState({ ... });`; otherwise, the component will not be updated.

```typescript
class StatefulExample extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  onClick = () => {
    this.setState({ value: this.state.value + 1 });
  }

  render() {
    return (
      <div>
        <button onClick={this.onClick}>{this.state.value}</button>
      </div>
    )
  }
}
```

### Shared state

Components are very much isolated. When multiple components need to share some state, it is therefore necessary to implement this state in a common ancestor of both components. This concept is known as [lifting state up](https://reactjs.org/docs/lifting-state-up.html). In short, you need to ensure the following:

- a common ancestor of all sharing components takes care of retrieving `this.state` and of invoking `this.setState`.
- all sharing components retrieve the value of this state through `this.props`
- all sharing components make changes to the common state through callbacks, which the ancestor provides through props as well.

### "this" is undefined in callbacks of a Component

Component functions can be defined in two ways. Only one if these ways can be used as a callback which references the component with the `this` keyword:

```typescript
class CallbackExample extends Component {

  // onA will know "this"
  onA = (event) => {
    console.log(this);
  }

  // onB will NOT know "this"
  onB(event) {
    console.log(this);
  }

  render() {
    return (
      <div>
        <button onClick={this.onA}>A</button>
        <button onClick={this.onB}>B</button>
      </div>
    )
  }
}
```

### Reading and writing files through the "fs" module

File access through the `fs` module is disabled by default because this module is typically unavailable on websites. However, we are developing a desktop app here, so this aspect of a website's security concerns does not apply for us.

We need to manually activate the possibility to use the `fs` module. This process is documented in the [native modules section](https://electron-react-boilerplate.js.org/docs/native-modules) of the boilerplate project, unfortunately without a hint that this process actually solves our issue.
