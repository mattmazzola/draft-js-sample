import * as React from 'react'
import './CustomToolbar.css'
import { IOption, Position } from './models'


interface Props {
  options: IOption[]
  position: Position
  isVisible: boolean
}

interface State {
  searchText: string
  matchedOptions: IOption[]
}

const initialState: State = {
  searchText: '',
  matchedOptions: []
}

export default class Toolbar extends React.Component<Props, State> {
  private element: any

  state = initialState

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isVisible === false
      && nextProps.isVisible === true) {
      this.setState({
        ...initialState
      })
    }
  }

  onRef = (node: any) => {
    this.element = node
  }

  preventDefault = (event: React.MouseEvent<any>) => {
    console.log('preventDefault', event)
    // event.stopPropagation()
  }

  onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value
    const matchedOptions = this.props.options.filter(option => option.name.startsWith(searchText))

    this.setState({
      searchText,
      matchedOptions
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
        onMouseDown={this.preventDefault}
        className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`}
        style={this.getPosition(this.props.position)}
        ref={this.onRef}
      >
        <div className="custom-toolbar__results">
          {this.state.matchedOptions.length !== 0
            && <ul>
              {this.state.matchedOptions.map(option => <li key={option.id}>{option.name}</li>)}
            </ul>}
        </div>
        <div className="custom-toolbar__search">
          <span>Search for entities</span>
          <input
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