import * as React from 'react'
import { EditorState, convertFromRaw, convertToRaw, RawDraftContentState } from 'draft-js'
import MentionEditor from './MentionEditor/MentionEditor'
import { IMention } from './mentions'
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
  mentionRawContentState: RawDraftContentState
}

interface Props {
  suggestions: IMention[]
  object: IObject | null
  onSubmit: (object: IObject) => void
  onReset: () => void
}

interface State {
  title: string
  type: string
  mentionEditorState: EditorState
  editorKey: number
}

const initialState: State = {
  title: '',
  type: types[1],
  mentionEditorState: EditorState.createEmpty(),
  editorKey: 0
}

export default class extends React.Component<Props, State> {
  state = initialState

  componentWillReceiveProps(nextProps: Props) {
    // If user selected an object, render the object's properties
    if (nextProps.object === null) {
      return
    }
    
    const { mentionPhrase } = nextProps.object
    const rg = /\[[\s\w]+\]/g

    const rawContent = {
      blocks: [] as any[],
      entityMap: {}
    }

    let endOfLastMatch = 0
    let match
    while(match = rg.exec(mentionPhrase)) {
      const textBeforeMatch = mentionPhrase.slice(endOfLastMatch, match.index)
      if (textBeforeMatch.length > 0) {
        rawContent.blocks.push({
          text: textBeforeMatch,
          type: 'unstyled',
          entityRanges: [],
          key: `block-2`
        })
      }

      const matchText = match[0]
      const mentionName = matchText.substring(1, matchText.length - 1)
      const entitykey = `entity-${Math.floor(Math.random() * 100)}`
      const mention = this.props.suggestions.find(m => m.name === mentionName)
      rawContent.blocks.push({
        text: matchText,
        type: 'unstyled',
        entityRanges: [
          {offset: match.index, length: matchText, key: entitykey }
        ],
        key: `block-${entitykey}`
      })
      rawContent.entityMap[entitykey] = {
        type: '[mention',
        mutability: 'IMMUTABLE',
        data: {
          mention
        }
      }

    }

    const contentState = convertFromRaw(rawContent)
    let editorState = EditorState.createWithContent(contentState)
    editorState = EditorState.moveFocusToEnd(editorState)
    editorState = EditorState.moveSelectionToEnd(editorState)

    this.setState({
      title: nextProps.object.title,
      type: nextProps.object.type,
      mentionEditorState: editorState,
      editorKey: this.state.editorKey + 1
    })
  }

  onReset = (e: React.FormEvent<any>) => {
    e.preventDefault()

    this.props.onReset()
    this.setState({
      ...initialState,
      editorKey: this.state.editorKey + 1
    })
  }

  onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()

    const contentState = this.state.mentionEditorState.getCurrentContent()
    const rawConent = convertToRaw(contentState)
    const rawText = contentState.getPlainText()
    const newObject: IObject = {
      id: `object-${new Date().getTime()}`,
      title: this.state.title,
      type: this.state.type,
      mentionPhrase: rawText,
      mentionRawContentState: rawConent
    }

    if (this.props.object) {
      console.log('update object')
      newObject.id = this.props.object.id
    }

    this.props.onSubmit(newObject)
    this.setState({
      ...initialState,
      editorKey: this.state.editorKey + 1
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
            type="text"
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
          allSuggestions={this.props.suggestions}
          editorState={this.state.mentionEditorState}
          placeholder="Enter a mention phrase"
          onChange={this.onChangeMentionEditor}
          key={this.state.editorKey}
        />

        <div>
          <button type="submit" className="djs-button">Submit</button>
          <button type="reset" className="djs-button">Reset</button>
        </div>
      </form>
    );
  }
}
