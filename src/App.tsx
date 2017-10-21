import * as React from 'react'
import ObjectEditor, { IObject } from './ObjectEditor'
import mentions, { IMention } from './mentions'
import './App.css'

interface Props {
}

interface State {
  mentions: IMention[],
  newMentionValue: string,
  objects: IObject[],
  selectedObject: IObject | null
}

export default class extends React.Component<Props, State> {
  state: State = {
    mentions,
    newMentionValue: '',
    objects: [],
    selectedObject: null
  }

  onChangeNewMention = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newMentionValue: e.target.value
    })
  }

  onSubmitNewMention = (e: React.FormEvent<any>) => {
    e.preventDefault()

    const newMention: IMention = {
      id: `mention-${(new Date().getTime())}`,
      link: '',
      name: this.state.newMentionValue
    }

    this.setState(prevState => ({
      mentions: [...prevState.mentions, newMention],
      newMentionValue: ''
    }))
  }

  onResetObjectEditor = () => {
    this.setState({
      selectedObject: null
    })
  }
  
  onSubmitObject = (newObject: IObject) => {
    // Editing: Update object
    if (this.state.selectedObject) {
      const existingObjectIndex = this.state.objects.findIndex(o => o.id === newObject.id)
      if (existingObjectIndex < 0) {
        throw new Error(`Attempting to update object: ${newObject.id} but could not find it in list of existing objects.`)
      }
      this.setState(prevState => ({
        objects: [...prevState.objects.slice(0, existingObjectIndex), newObject, ...prevState.objects.slice(existingObjectIndex + 1)],
        selectedObject: null
      }))
    }
    // Not Editing: New object
    else {
      this.setState(prevState => ({
        objects: [...prevState.objects, newObject]
      }))
    }
  }

  onClickObject = (object: IObject) => {
    this.setState({
      selectedObject: object
    })
  }

  render() {
    return (
      <div id="content">
        <header>
          <h1>Draft.js Editor Sample</h1>
        </header>

        <div className="lists-grid">
          <div>
            <h2>Total Mentions:</h2>

            <h3>Create Mention:</h3>
            <form onSubmit={this.onSubmitNewMention} className="mentionForm" >
              <input
                required={true}
                value={this.state.newMentionValue}
                onChange={this.onChangeNewMention}
              />
              <div>
                <button type="submit">Create</button>
              </div>
            </form>
            <ul>
              {this.state.mentions.length === 0
                ? <li>There are no mentions</li>
                : this.state.mentions.map(mention =>
                  <li key={mention.id}>{mention.id} : {mention.name}</li>
                )}
            </ul>
          </div>

          <div>
            <h2>Compound Objects:</h2>

            <h3>Create new object:</h3>
            <ObjectEditor
              onSubmit={this.onSubmitObject}
              onReset={this.onResetObjectEditor}
              object={this.state.selectedObject}
            />

            <h3>Objects:</h3>
            <ul>
              {this.state.objects.length === 0
                ? <li>There are no objects</li>
                : this.state.objects.map(object =>
                  <li key={object.id}>
                    Id: {object.id}<br />
                    <b>Title: {object.title}</b><br />
                    Type: {object.type} <br />
                    Phrase: {object.mentionPhrase} <br />
                    <button
                      type="button"
                      onClick={() => this.onClickObject(object)}
                    >Edit</button>
                  </li>
                )}
            </ul>
          </div>
        </div>

        <footer>
          <h3>Requirements:</h3>
          <ul>
            <li>Demonstrate loading state from previously created object, editing object and saving</li>
            <li>Demonstrate mentions to exclude those already included in the editor state</li>
          </ul>
        </footer>
      </div>
    );
  }
}
