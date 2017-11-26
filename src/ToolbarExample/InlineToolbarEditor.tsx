import * as React from 'react'
import { Editor, EditorState, Modifier, SelectionState, getVisibleSelectionRect } from 'draft-js'
import 'draft-js/dist/Draft.css'
import './InlineToolbarEditor.css'
import EntityPickerContainer from './EntityPickerContainer'
import { IOption, IBlisCustomEntityData, Position, customEntityType } from './models'
import { getSelectionStateDate } from './utilities'


const getRelativeParent = (element: HTMLElement | null): HTMLElement => {
  if (!element) {
    return document.body;
  }

  const position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

interface Props {
  options: IOption[]
  editorState: EditorState
  placeholder: string
  onChange: (editorState: EditorState) => void
  onEntityCreated: (editorState: EditorState) => void
}

interface State {
  toolbarPosition: Position
  isToolbarVisible: boolean
  selectionState: SelectionState | null
}

export default class extends React.Component<Props, State> {
  state: State = {
    toolbarPosition: {
      top: 0,
      bottom: 0,
      left: 0
    },
    isToolbarVisible: false,
    selectionState: null
  }
  toolbar: HTMLElement
  domEditor: any

  setDomEditorRef = (ref: any) => this.domEditor = ref

  onChange = (editorState: EditorState) => {
    this.onChangeSelection(editorState.getSelection())
    this.props.onChange(editorState)
  }

  onClickEditorContainer = () => {
    console.log('onClickEditorContainer')
    // this.domEditor.focus()
  }

  onChangeSelection = (selectionState: SelectionState) => {
    setTimeout((() => {
      const relativeParent = getRelativeParent(this.toolbar.parentElement)
      const toolbarHeight = this.toolbar.clientHeight
      const relativeRect = relativeParent.getBoundingClientRect();
      const selectionRect = getVisibleSelectionRect(window)
      if (!selectionRect) {
        return
      }

      const dropdownOffset = 40
      const position: Position = {
        top: (selectionRect.top - relativeRect.top) - toolbarHeight - dropdownOffset,
        bottom: relativeRect.height - (selectionRect.top - relativeRect.top) + dropdownOffset,
        left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      }

      console.log(`InlineToolbarEditor.onChangeSelection.selectionState: `, getSelectionStateDate(selectionState))

      const isToolbarVisible = !selectionState.isCollapsed() && selectionState.getHasFocus()

      this.setState(prevState => ({
        toolbarPosition: isToolbarVisible ? position : prevState.toolbarPosition,
        isToolbarVisible,
        selectionState
      }))
    }).bind(this))
  }

  onToolbarRef = (node: EntityPickerContainer) => {
    this.toolbar = node.element
  }

  onSelectOption = (option: IOption) => {
    console.log(`option selected: `, option)

    // Create entity representing option selected
    const contentState = this.props.editorState.getCurrentContent()
    const selectionState = this.props.editorState.getSelection()
    console.log(`currentSelectionState: `, getSelectionStateDate(selectionState))
    const contentStateWithEntity = contentState.createEntity(
      customEntityType,
      'IMMUTABLE',
      {
        option,
        selectionState
      } as IBlisCustomEntityData
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const contentStateWithCustomEntity = Modifier.applyEntity(
      contentStateWithEntity,
      selectionState,
      entityKey
    )
    const editorStateWithEntity = EditorState.push(this.props.editorState, contentStateWithCustomEntity, 'apply-entity')
    this.props.onEntityCreated(editorStateWithEntity)
    this.setState({
      isToolbarVisible: false
    })
  }

  render() {
    return (
      <div className="toolbar-editor" onClick={this.onClickEditorContainer}>
        <Editor
          placeholder={this.props.placeholder}
          editorState={this.props.editorState}
          onChange={this.onChange}
          handleDrop={() => "handled"}
          ref={this.setDomEditorRef}
        />
        <EntityPickerContainer
          position={this.state.toolbarPosition}
          isVisible={this.state.isToolbarVisible}
          ref={this.onToolbarRef}
          options={this.props.options}
          maxDisplayedOptions={4}
          onSelectOption={this.onSelectOption}
        />
      </div>
    )
  }
}