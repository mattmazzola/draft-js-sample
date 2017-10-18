import * as React from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import mentions, { IMention } from './mentions'
import './App.css'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'

interface Props {
}

interface State {
  editorState: EditorState,
  suggestions: IMention[]
}

class App extends React.Component<Props, State> {
  domEditor: any
  mentionPlugin: any
  state = {
    editorState: EditorState.createEmpty(),
    suggestions: mentions
  }
  constructor(props: Props) {
    super(props);

    this.mentionPlugin = createMentionPlugin();
  }

  componentDidMount() {
    this.domEditor.focus()
  }

  setDomEditorRef = (ref: any) => this.domEditor = ref

  onChange = (editorState: EditorState) => {
    this.setState({
      editorState
    })
  }

  onSearchChange = ({ value }: { value: string }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  }

  onAddMention = () => {
    // get the mention object selected
  }

  onClickEditorContainer = () => {
    this.domEditor.focus()
  }

  render() {
    const { MentionSuggestions } = this.mentionPlugin
    const plugins = [this.mentionPlugin]

    return (
      <div id="content">
        <h1>Draft.js Editor</h1>

        <div className="editor" onClick={this.onClickEditorContainer}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={this.setDomEditorRef}
          />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
            onAddMention={this.onAddMention}
          />
        </div>
      </div>
    );
  }
}

export default App;
