import * as React from 'react'
import { EditorState } from 'draft-js'
import MentionEditor from './MentionEditor'
import './ObjectEditor.css'

const types: string[] = [
  'Type 1',
  'Type 2',
  'Type 3'
]

export interface IObject {
  id: string
  title: string
  type: string
  mentionPhrase: string
}

interface Props {
  object: IObject | null
  onSubmit: (object: IObject) => void
  onReset: () => void
}

interface State {
  title: string
  type: string
  mentionEditorState: EditorState
}

const initialState: State = {
  title: '',
  type: types[1],
  mentionEditorState: EditorState.createEmpty()
}

export default class extends React.Component<Props, State> {
  state = initialState

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.object !== null) {
      this.setState({
        title: nextProps.object.title,
        type: nextProps.object.type,
        mentionEditorState: EditorState.createEmpty()
      })
    }
    else {
      this.setState({
        ...initialState
      })
    }
  }

  onReset = (e: React.FormEvent<any>) => {
    e.preventDefault()

    this.props.onReset()
    this.setState({
      ...initialState
    })
  }

  onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()

    const newObject: IObject = {
      id: `object-${new Date().getTime()}`,
      title: this.state.title,
      type: this.state.type,
      mentionPhrase: 'default mention phrase'
    }

    if (this.props.object) {
      console.log('update object')
      newObject.id = this.props.object.id
    }

    this.props.onSubmit(newObject)
    this.setState({
      ...initialState
    })
  }

  onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value
    })
  }

  onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      type: e.target.value
    })
  }

  onChangeMentionEditor = (editorState: EditorState) => {
    this.setState({
      mentionEditorState: editorState
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} onReset={this.onReset} className="objectForm">
        <div>Title:</div>
        <div>
          <input
            value={this.state.title}
            onChange={this.onChangeTitle}
            placeholder="Enter a title"
            required={true}
          />
        </div>

        <div>Type</div>
        <select
          value={this.state.type}
          onChange={this.onChangeType}
          required={true}
        >
          {types.map((type, i) =>
            <option key={i}>{type}</option>
          )}
        </select>

        <div>Mention Phrase:</div>
        <MentionEditor
          editorState={this.state.mentionEditorState}
          placeholder="Enter a mention phrase"
          onChange={this.onChangeMentionEditor}
        />

        <div>
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </form>
    );
  }
}
