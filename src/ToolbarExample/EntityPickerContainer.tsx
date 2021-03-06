import * as React from 'react'
import EntityPicker from './EntityPicker'
import { IOption, Position } from './models'

interface Props {
  options: IOption[]
  maxDisplayedOptions: number
  position: Position
  isVisible: boolean
  onSelectOption: (o: IOption) => void
}

interface State {
  highlightIndex: number
  searchText: string
  matchedOptions: IOption[]
}

const initialState: State = {
  highlightIndex: 0,
  searchText: '',
  matchedOptions: []
}

type IndexFunction = (x: number, limit?: number) => number
// TODO: Id function doesn't need limit but TS requires consistent arguments
const id = (x: number) => x
const increment = (x: number, limit: number) => (x + 1) > limit ? 0 : x + 1
const decrement = (x: number, limit: number) => (x - 1) < 0 ? limit : x - 1

export default class EntityPickerContainer extends React.Component<Props, State> {
  element: HTMLElement

  state = initialState

  constructor(props: Props) {
    super(props)

    this.state.matchedOptions = props.options.filter((_, i) => i < props.maxDisplayedOptions)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isVisible === false
      && nextProps.isVisible === true) {
      const matchedOptions = this.props.options
        .filter(option => option.name.startsWith(this.state.searchText))
        .filter((_, i) => i < nextProps.maxDisplayedOptions)

      this.setState(prevState => ({
        ...initialState,
        matchedOptions,
        highlightIndex: prevState.highlightIndex > (matchedOptions.length - 1) ? 0 : prevState.highlightIndex
      }))
    }
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    console.log(`onKeyDown `, event.key)
    let modifyFunction: IndexFunction = id

    switch (event.key) {
      case 'ArrowUp': {
        modifyFunction = decrement
        break;
      }
      case 'ArrowDown':
        modifyFunction = increment
        break;
      case 'Enter':
      case 'Tab':
        this.onSelectHighlightedOption()
        event.stopPropagation()
        event.preventDefault()
        break;
    }

    this.setState(prevState => ({
      highlightIndex: modifyFunction(prevState.highlightIndex, prevState.matchedOptions.length - 1)
    }))
  }

  onSelectHighlightedOption = () => {
    const option = this.state.matchedOptions[this.state.highlightIndex]
    this.props.onSelectOption(option)
    this.setState({
      ...initialState
    })
  }

  onMouseDown = (event: React.MouseEvent<any>) => {
    console.log('onMouseDown', event)
    // event.stopPropagation()
  }

  onChangeSearchText = (searchText: string) => {
    const matchedOptions = this.props.options
      .filter(option => option.name.startsWith(searchText))
      .filter((_, i) => i < this.props.maxDisplayedOptions)

    this.setState(prevState => ({
      searchText,
      matchedOptions,
      highlightIndex: prevState.highlightIndex > (matchedOptions.length - 1) ? 0 : prevState.highlightIndex
    }))
  }

  onClickResult = (option: IOption) => {
    console.log(`CustomToolbar.onClickResult: `, option)
    this.props.onSelectOption(option)
    this.setState({
      ...initialState
    })
  }

  onRef = (node: EntityPicker) => {
    this.element = node.element
  }

  getPosition = (position: Position) => {
    const { bottom, left } = position
    return {
      bottom,
      left
    }
  }

  render() {
    return (
        <EntityPicker
          highlightIndex={this.state.highlightIndex}
          isVisible={this.props.isVisible}
          matchedOptions={this.state.matchedOptions}
          maxDisplayedOptions={this.props.maxDisplayedOptions}
          position={this.props.position}
          ref={this.onRef}
          searchText={this.state.searchText}

          onChangeSearchText={this.onChangeSearchText}
          onClickOption={this.onClickResult}
          onKeyDown={this.onKeyDown}
          onMouseDown={this.onMouseDown}
        />
    )
  }
}