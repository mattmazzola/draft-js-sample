import * as React from 'react'
import wordTypes, { IWordType } from './classes'

interface Props {
}

interface State {
  wordTypes: IWordType[],
  newWordTypeValue: string,
  sentences: string[],
  selectedSentence: string | null
}

export default class extends React.Component<Props, State> {
  state: State = {
    wordTypes,
    newWordTypeValue: '',
    sentences: [],
    selectedSentence: null
  }

  onChangenewWordType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newWordTypeValue: e.target.value
    })
  }

  onSubmitNewWordType = (e: React.FormEvent<any>) => {
    e.preventDefault()

    const newWordType: IWordType = {
      id: `wordType-${(new Date().getTime())}`,
      name: this.state.newWordTypeValue,
      multivalue: false
    }

    this.setState(prevState => ({
      wordTypes: [...prevState.wordTypes, newWordType],
      newWordTypeValue: ''
    }))
  }

  render() {
    return (
        <section>
          <h2>Custom Inline Toolbar</h2>
          <h3>Requirements:</h3>
          <ul>
            <li>When user selects text render custom toolbar with dropdown menu near text</li>
            <li>After word type is selected from dropdown show text in different color</li>
            <li>Open menu to select other word type or delete selection if clicking exisint entity</li>
          </ul>

          <div className="lists-grid">
            <div>
              <h2>Total Word Types:</h2>

              <h3>Create Word Type:</h3>
              <form onSubmit={this.onSubmitNewWordType} className="classForm" >
                <input
                  required={true}
                  value={this.state.newWordTypeValue}
                  onChange={this.onChangenewWordType}
                />
                <div>
                  <button type="submit">Create</button>
                </div>
              </form>
              <ul>
                {this.state.wordTypes.length === 0
                  ? <li>There are no mentions</li>
                  : this.state.wordTypes.map(wordType =>
                    <li key={wordType.id}>{wordType.id} : {wordType.name}</li>
                  )}
              </ul>
            </div>

            <div>
              <h2>Classif Sentence:</h2>
              <h3>Create new sentence:</h3>


              <h3>Classified sentences:</h3>

            </div>
          </div>
        </section>
    )
  }
}
