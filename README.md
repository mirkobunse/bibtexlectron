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

In addition to BibTeX management, bibtexlectron is intended to serve as a learning platform for React developers. Following this intention, we address some of the typical fallacies that might appear to React newcomers.

### Structure of this project

The electron-react-boilerplate is separated in an Electron main process (which draws the window, reads and writes files, etc) and a React-based renderer process (essentially a website that is rendered in the window canvas). The two process communicate via Electrons inter-process communication (IPC) facilities. The file structure is as follows:

```
bibtexlectron/
 └─┬─ src/
   ├─┬─ main/
   │ └─┬─ main.ts      // the main process, e.g. opening and reading files
   │   ├─ menu.ts      // the menu bar of the Electron window
   │   ├─ preload.js   // IPC setup
   │   └─ util.ts
   ├─┬─ renderer/
   │ └─┬─ App.css      // custom styling
   │   ├─ App.tsx      // the renderer process
   │   ├─ Editor.tsx   // a modal for editing BibTeX entries
   │   ├─ index.ejs    // part of the entrypoint which opens App.tsx
   │   ├─ index.tsx    // part of the entrypoint which opens App.tsx
   │   ├─ MenuBar.tsx  // an in-app menu bar
   │   ├─ ToolBar.tsx  // a tool bar
   │   ├─ io/          // parsing and writing BibTeX from plain text
   ┊   └─ view/        // BibTeX views, most importantly the TableView
```

### Stateful React Components

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

### Shared state in React Components

Each components is isolated. When multiple components need to share some state, it is therefore necessary to implement this state in a common ancestor of both components. This concept is known as [lifting state up](https://reactjs.org/docs/lifting-state-up.html). In short, you need to ensure the following:

- a common ancestor of all sharing components takes care of reading `this.state` and of invoking `this.setState`.
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

### IPC example: reading and writing files through the "fs" module

In electron, it is a best practice to keep the `fs` module disabled within the renderer process. This best-practice also holds for all other so-called native modules which are not available within websites.

Therefore, any native module, such as `fs`, needs to be called from the main process, which then provides the results to the renderer process via IPC. For instance, the renderer can ask the main process to read a file.
