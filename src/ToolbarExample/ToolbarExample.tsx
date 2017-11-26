import * as React from 'react'
import wordTypes, { IWordType } from './classes'
import { ContentBlock, ContentState, EditorState, EntityInstance, Modifier, CompositeDecorator } from 'draft-js'
import InlineToolbarExapmle from './InlineToolbarEditor'
import CustomEntityContainer from './CustomEntityContainer'
import { IOption, IBlisCustomEntityData, customEntityType } from './models'

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

function findLinkEntities(contentBlock: ContentBlock, callback: any, contentState: ContentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === customEntityType
      )
    },
    callback
  )
}

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    // TODO: Find more elegate way to spread props onto component
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: (componentProps: any) => (
          <CustomEntityContainer
            onClickDelete={this.onClickDeleteCustomEntity}
            entityKey={componentProps.entityKey}
            contentState={componentProps.contentState}
          >
            {componentProps.children}
          </CustomEntityContainer>
        )
      }
    ])

    this.state = {
      wordTypes,
      newWordTypeValue: '',
      newWordTypeMultivalue: false,
      inlineToolbarEditorState: EditorState.createEmpty(decorator),
      sentences: [],
      selectedSentence: null
    }
  }

  onClickDeleteCustomEntity = (entity: EntityInstance) => {
    console.log(`onClickDeleteCustomEntity`, entity)
    const customEntityData = entity.getData() as IBlisCustomEntityData
    const entitySelectionState = customEntityData.selectionState
    const editorState = this.state.inlineToolbarEditorState
    const contentState = editorState.getCurrentContent()
    const contentStateWithoutEntity = Modifier.applyEntity(
      contentState,
      entitySelectionState,
      null!
    )

    // TODO: Find way to use EditorState.push to preserve undo mechanics;
    // howver, when using this it removes decorators
    // const editorStateWithoutEntity = EditorState.set(editorState, { currentContent: contentStateWithoutEntity })
    const editorStateWithoutEntity = EditorState.push(editorState, contentStateWithoutEntity, 'apply-entity' )
    
    this.setState({
      inlineToolbarEditorState: editorStateWithoutEntity
    })
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

  onEntityCreated = (editorState: EditorState) => {
    console.log(`ToolbarExample.onEntityCreated`, editorState)
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
                onEntityCreated={this.onEntityCreated}
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
