import * as React from 'react'
import MentionExample from './MentionExample'
import ToolbarExample from './ToolbarExample'
import './App.css'

interface Props {
}

interface State {
}

export default class extends React.Component<Props, State> {
  render() {
    return (
      <div id="content">
        <header>
          <h1>Draft.js Editor Sample</h1>
        </header>

        <MentionExample />

        <ToolbarExample />

        <footer>
          <h3>Resources</h3>
          <ul>
            <li><a href="https://draftjs.org">https://draftjs.org</a></li>
            <li><a href="https://draftjs.slack.com">https://draftjs.slack.com</a></li>
          </ul>
        </footer>
      </div>
    );
  }
}
