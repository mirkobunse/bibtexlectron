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
