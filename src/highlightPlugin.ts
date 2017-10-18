import * as React from 'react'
import { EditorState, RichUtils } from 'draft-js'

const defaultStyle = {
  background: 'blue',
  padding: '0 .3em',
  color: '#fff',
};

export default (style = {}) => {
  return {
    customStyleMap: {
      'HIGHLIGHT': {
        ...defaultStyle,
        ...style,
      },
    },
    keyBindingFn: (e: React.KeyboardEvent<{}>) => {
      console.log(`keyBindingFn: e.metaKey: ${e.metaKey}, e.key: ${e.key}, e.getModifierState('Shift'): ${e.getModifierState('Alt')}`)
      if (e.getModifierState('Alt') && e.key === 'h') {
        return 'highlight'
      }

      return undefined
    },
    handleKeyCommand: (command: string, editorState: EditorState, { setEditorState }: any) => {
      console.log(`handleKeyCommand: command: ${command}`)
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
        return true;
      }

      return undefined
    },
  };
};