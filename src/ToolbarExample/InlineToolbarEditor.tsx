import * as React from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'
import 'draft-js/dist/Draft.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'

interface Props {
  editorState: EditorState
  placeholder: string
  onChange: (editorState: EditorState) => void
}

interface State {
}

const inlineToolbarPlugin = createInlineToolbarPlugin({
});
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];

export default class extends React.Component<Props, State> {
  domEditor: any

  setDomEditorRef = (ref: any) => this.domEditor = ref

  onChange = (editorState: EditorState) => {
    this.props.onChange(editorState)
  }

  onClickEditorContainer = () => {
    this.domEditor.focus()
  }

  render() {
    return (
      <div className="editor" onClick={this.onClickEditorContainer}>
        <Editor
          placeholder={this.props.placeholder}
          editorState={this.props.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={this.setDomEditorRef}
        />
        <InlineToolbar />
      </div>
    )
  }
}