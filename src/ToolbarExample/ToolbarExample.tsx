import * as React from 'react'
import wordTypes, { IWordType } from './classes'
import { EditorState } from 'draft-js'
import { createEditorStateWithText } from 'draft-js-plugins-editor'
import InlineToolbarExapmle from './InlineToolbarEditor'
import { IOption } from './models'

interface Props {
}

interface State {
  wordTypes: IWordType[]
  newWordTypeValue: string
  newWordTypeMultivalue: boolean
  inlineToolbarEditorState: EditorState
  sentences: string[]
  selectedSentence: string | null
}

const convertToOption = (wordType: IWordType): IOption =>
  ({
    id: wordType.id,
    name: wordType.name
  })

export default class extends React.Component<Props, State> {
  state: State = {
    wordTypes,
    newWordTypeValue: '',
    newWordTypeMultivalue: false,
    inlineToolbarEditorState: createEditorStateWithText("test"),
    sentences: [],
    selectedSentence: null
  }

  onChangeNewWordType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newWordTypeValue: e.target.value
    })
  }

  onChangeWordTypeMultivalue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newWordTypeMultivalue: e.target.checked
    })
  }

  onSubmitNewWordType = (e: React.FormEvent<any>) => {
    e.preventDefault()

    const newWordType: IWordType = {
      id: `wordType-${(new Date().getTime())}`,
      name: this.state.newWordTypeValue,
      multivalue: this.state.newWordTypeMultivalue
    }

    this.setState(prevState => ({
      wordTypes: [...prevState.wordTypes, newWordType],
      newWordTypeValue: '',
      newWordTypeMultivalue: false
    }))
  }

  onChangeEditorState = (editorState: EditorState) => {
    this.setState({
      inlineToolbarEditorState: editorState
    })
  }

  onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault()

    console.log(this.state.sentences)
    this.setState(prevState => ({
      sentences: [...prevState.sentences, prevState.inlineToolbarEditorState.getCurrentContent().getPlainText()],
      inlineToolbarEditorState: EditorState.createEmpty()
    }))
  }

  onReset = (e: React.FormEvent<any>) => {
    e.preventDefault()

    this.setState({
      inlineToolbarEditorState: EditorState.createEmpty()
    })
  }

  render() {
    return (
      <section>
        <header className="subheader">
          <div className="container">
            <h1>Custom Inline Toolbar</h1>
            <h3>Requirements:</h3>
            <ul>
              <li>When user selects text render custom toolbar with dropdown menu near text</li>
              <li>After word type is selected from dropdown show text in different color</li>
              <li>Open menu to select other word type or delete selection if clicking exisint entity</li>
            </ul>
          </div>
        </header>

        <div className="container lists-grid">
          <div>
            <h2>Total Word Types:</h2>

            <h3>Create Word Type:</h3>
            <form onSubmit={this.onSubmitNewWordType} className="classForm">
              <div>Name:</div>
              <input
                type="text"
                required={true}
                value={this.state.newWordTypeValue}
                onChange={this.onChangeNewWordType}
              />

              <label htmlFor="multivalue">
                <input
                  id="multivalue"
                  type="checkbox"
                  checked={this.state.newWordTypeMultivalue}
                  onChange={this.onChangeWordTypeMultivalue}
                />
                Multi-Value
                </label>

              <div>
                <button type="submit" className="djs-button">Create</button>
              </div>
            </form>
            <ul>
              {this.state.wordTypes.length === 0
                ? <li>There are no mentions</li>
                : this.state.wordTypes.map(wordType =>
                  <li key={wordType.id}>{wordType.id} : {wordType.name} [{wordType.multivalue ? 'multi' : 'single'}]</li>
                )}
            </ul>
          </div>

          <div>
            <h2>Classify Sentence:</h2>
            <h3>Create new sentence:</h3>
            <form onSubmit={this.onSubmit} onReset={this.onReset} className="objectForm">
              <div>Sentence:</div>
              <InlineToolbarExapmle
                editorState={this.state.inlineToolbarEditorState}
                placeholder="Enter a sentence"
                onChange={this.onChangeEditorState}
                options={this.state.wordTypes.map(convertToOption)}
              />
              <div>
                <button type="submit" className="djs-button">Submit</button>
                <button type="reset" className="djs-button">Reset</button>
              </div>
            </form>

            <h3>Classified sentences:</h3>
            <ul>
              {this.state.sentences.length === 0
                ? <li>There are no sentences</li>
                : this.state.sentences.map((sentence, i) =>
                  <li key={i}>{sentence}</li>
                )}
            </ul>
          </div>
        </div>
      </section>
    )
  }
}
