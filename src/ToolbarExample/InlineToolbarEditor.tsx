import * as React from 'react'
import { Editor, EditorState, SelectionState, getVisibleSelectionRect } from 'draft-js'
import 'draft-js/dist/Draft.css'
import './InlineToolbarEditor.css'
import CustomToolbar from './CustomToolbar'
import { IOption, Position } from './models'

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
}

interface State {
  toolbarPosition: Position
  isToolbarVisible: boolean
}

export default class extends React.Component<Props, State> {
  state: State = {
    toolbarPosition: {
      top: 0,
      bottom: 0,
      left: 0
    },
    isToolbarVisible: false
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
      const position: Position = {
        top: (selectionRect.top - relativeRect.top) - toolbarHeight - 20,
        bottom: relativeRect.height - (selectionRect.top - relativeRect.top) + 20,
        left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      }
      console.log(`selectionRect `, selectionRect)
      console.log(`relativeParentRect `, relativeRect)
      console.log(`top`, position.top)
      console.log(`bottom`, position.bottom)

      const isToolbarVisible = !selectionState.isCollapsed() && selectionState.getHasFocus()

      this.setState(prevState => ({
        toolbarPosition: isToolbarVisible ? position : prevState.toolbarPosition,
        isToolbarVisible
      }))
    }).bind(this))
  }

  onToolbarRef = (node: any) => {
    this.toolbar = node.element
  }

  onSelectOption = (option: IOption) => {
    console.log(`option selected: `, option)
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
        <CustomToolbar
          position={this.state.toolbarPosition}
          isVisible={this.state.isToolbarVisible}
          ref={this.onToolbarRef}
          options={this.props.options}
          onSelectOption={this.onSelectOption}
        />
      </div>
    )
  }
}