import * as React from 'react'
import MentionExample from './MentionExample/MentionExample'
import ToolbarExample from './ToolbarExample/ToolbarExample'
import SelectionExample from './SelectionExample/SelectionExample'
import './App.css'

interface Props {
}

interface State {
}

export default class extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <header>
          <div className="container">
            <h1>Draft.js Editor Sample</h1>
          </div>
        </header>

        <div>
          <MentionExample />

          <ToolbarExample />

          <SelectionExample />
        </div>
        <footer>
          <div className="container">
            <h3>Resources</h3>
            <ul>
              <li><a href="https://draftjs.org">https://draftjs.org</a></li>
              <li><a href="https://draftjs.slack.com">https://draftjs.slack.com</a></li>
            </ul>
          </div>
        </footer>
      </div>
    );
  }
}
