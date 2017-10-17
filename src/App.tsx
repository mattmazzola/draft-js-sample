import * as React from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import 'draft-js-mention-plugin/lib/plugin.css'
import './App.css'
import mentions from './mentions'

export default class SimpleMentionEditor extends React.Component<{}, {}> {
  editor: any
  mentionPlugin: any

  constructor(props: any) {
    super(props);

    this.mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '@'
    });
  }

  state = {
    editorState: EditorState.createEmpty(),
    suggestions: mentions,
  };

  onChange = (editorState: EditorState) => {
    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }: any) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  };

  onAddMention = (mention: any) => {
    console.log(`onAddMention: `, mention)
    // get the mention object selected
  }

  focus = () => {
    this.editor.focus();
  };

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    return (
      <div className="editorContainer">
        <div className="editor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element: any) => { this.editor = element }}
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