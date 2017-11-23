import * as React from 'react'
import './CustomToolbar.css'
import { IOption, Position } from './models'


interface Props {
  options: IOption[]
  position: Position
  isVisible:  boolean
}

export default class Toolbar extends React.Component<Props, {}> {
  private element: any

  getStyle(position: Position) {
    // overrideContent could for example contain a text input, hence we always show overrideContent
    // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
    const style: any = { ...position }

    if (this.props.isVisible) {
      style.visibility = 'visible';
      style.transform = 'translate(-50%) scale(1)';
      style.transition = 'transform 0.15s cubic-bezier(.3,1.2,.2,1)';
    } else {
      style.transform = 'translate(-50%) scale(0)';
      style.visibility = 'hidden';
    }

    return style;
  }

  onRef = (node: any) => {
    this.element = node
  }

  render() {
    return (
      <div
        className={`custom-toolbar ${this.props.isVisible ? "custom-toolbar--visible" : ""}`}
        style={this.getStyle(this.props.position)}
        ref={this.onRef}
      >
        Custom Toolbar
      </div>
    );
  }
}