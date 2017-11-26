import * as React from 'react'
import './EntityPicker.css'
import { IOption, Position } from './models'

interface Props {
  highlightIndex: number
  isVisible: boolean
  matchedOptions: IOption[]
  maxDisplayedOptions: number
  onChangeSearchText: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
  onMouseDown: (event: React.MouseEvent<HTMLElement>) => void
  onClickOption: (o: IOption) => void
  position: Position
  searchText: string
}

export default class EntityPicker extends React.Component<Props, {}> {
  element: HTMLElement
  
  onRef = (node: any) => {
    this.element = node
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
        onMouseDown={this.props.onMouseDown}
        onKeyDown={this.props.onKeyDown}
        className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`}
        style={this.getPosition(this.props.position)}
        ref={this.onRef}
      >
        {this.props.matchedOptions.length !== 0
          && <ul className="custom-toolbar__results">
            {this.props.matchedOptions.map((option, i) =>
              <li
                key={option.id}
                onClick={() => this.props.onClickOption(option)}
                className={`custom-toolbar__result ${this.props.highlightIndex === i ? 'custom-toolbar__result--highlight' : ''}`}
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
            value={this.props.searchText}
            className="custom-toolbar__input"
            onChange={event => this.props.onChangeSearchText(event.target.value)}
          />
        </div>
      </div>
    );
  }
}