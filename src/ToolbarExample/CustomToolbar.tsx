import * as React from 'react'
import './CustomToolbar.css'
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

export default class Toolbar extends React.Component<Props, State> {
  private element: any

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

  onRef = (node: any) => {
    this.element = node
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

  onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value
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

  getPosition = (position: Position) => {
    const { bottom, left } = position
    return {
      bottom,
      left
    }
  }

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onKeyDown={this.onKeyDown}
        className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`}
        style={this.getPosition(this.props.position)}
        ref={this.onRef}
      >
        {this.state.matchedOptions.length !== 0
          && <ul className="custom-toolbar__results">
            {this.state.matchedOptions.map((option, i) =>
              <li
                key={option.id}
                onClick={() => this.onClickResult(option)}
                className={`custom-toolbar__result ${this.state.highlightIndex === i ? 'custom-toolbar__result--highlight' : ''}`}
              >
                {option.name}
              </li>
            )}
          </ul>}
        <div className="custom-toolbar__search">
          <label htmlFor="toolbar-input">Search for entities:</label>
          <input
            id="toolbar-input"
            type="text"
            value={this.state.searchText}
            className="custom-toolbar__input"
            onChange={this.onChangeSearchText}
          />
        </div>
      </div>
    );
  }
}