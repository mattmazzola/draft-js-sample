import * as React from 'react'
import './HeadlinesButton.css'

class HeadlinesPicker extends React.Component<Props, {}> {
  componentDidMount() {
    console.log(`${this.constructor.name} componentDidMount`)
    setTimeout(() => { window.addEventListener('click', this.onWindowClick) })
  }

  componentWillUnmount() {
    console.log(`${this.constructor.name} componentWillUnmount`)
    window.removeEventListener('click', this.onWindowClick)
  }

  onWindowClick = () => {
    console.log(`${this.constructor.name} onWindowClick`)
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined)
  }

  render() {
    return (
      <div>
        Headlines Picker
      </div>
    );
  }
}

console.log(HeadlinesPicker)

interface Props {
  onOverrideContent: (component: any) => void
}

export default class HeadlinesButton extends React.Component<Props, {}> {
  onClick = (event: React.MouseEvent<any>) => {
    event.preventDefault()
    console.log(`${this.constructor.name} onClick`)
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker)
  }

  onClickOtherButton = () => {
    console.log("onClickOtherButton")
  }

  preventBubble = (event: React.MouseEvent<any>) => {
    console.log('preventBubbble', event)
    event.preventDefault()
  }

  render() {
    return (
      <div
        className="headlineButtonWrapper"
        onMouseDown={this.preventBubble}
      >
        <button type="button" onClick={this.onClick} className="headlineButton">
          Headlines
        </button>
      </div>
    );
  }
}