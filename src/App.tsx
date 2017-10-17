import * as React from 'react'
import { Editor, EditorState, RichUtils, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, DraftEditorCommand, DraftHandleValue } from 'draft-js'
import './App.css'
import 'draft-js/dist/Draft.css'

const { hasCommandModifier } = KeyBindingUtil

interface Props {
}

interface State {
  editorState: EditorState
}

const styleMap = {
  'HIGHLIGHT': {
    backgroundColor: 'lightgreen'
  }
}

function keyBinding(e: React.KeyboardEvent<HTMLInputElement>): DraftEditorCommand | string | null {
  console.log(e.key, hasCommandModifier(e))
  if (e.key === 'ArrowUp' && hasCommandModifier(e)) {
    return 'blis-up';
  }

  return getDefaultKeyBinding(e)
}

class App extends React.Component<Props, State> {
  domEditor: any

  state = {
    editorState: EditorState.createEmpty()
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

  onClickBold = () => {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD'
    ))
  }

  onClickEditorContainer = () => {
    this.domEditor.focus()
  }

  onClickLogRawState = () => {
    const rawState = convertToRaw(this.state.editorState.getCurrentContent())
    console.log(JSON.stringify(rawState, null, '  '))
  }

  handleKeyCommand = (command: string): DraftHandleValue => {
    if (command === 'blis-up') {
      console.log('blis-up')
      return 'handled'
    }

    return 'not-handled'
  }

  render() {
    return (
      <div id="content">
        <h1>Draft.js Editor</h1>
        <button onClick={this.onClickBold}>Bold</button>
        <button onClick={this.onClickLogRawState}>Log Raw State</button>
        <button onClick={this.onClickLogRawState}>Log Raw State</button>
        <div className="editor" onClick={this.onClickEditorContainer}>
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
            keyBindingFn={keyBinding}
            ref={this.setDomEditorRef as any}
          />
        </div>
      </div>
    );
  }
}

export default App;
