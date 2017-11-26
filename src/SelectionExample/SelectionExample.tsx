import * as React from 'react'
import { Editor, EditorState, RawDraftContentState, convertFromRaw /*, SelectionState, Modifier */ } from 'draft-js'

// const getBlockKeys = (editorState: EditorState, entityType: string | null = null): any[] => {
//   const content = editorState.getCurrentContent();
//   const entities: any = [];
//   content.getBlocksAsArray().forEach((block) => {
//     let selectedEntity: any = null;
//     block.findEntityRanges(
//       (character) => {
//         if (character.getEntity() !== null) {
//           const entity = content.getEntity(character.getEntity());
//           if (!entityType || (entityType && entity.getType() === entityType)) {
//             const entityMap = content.getEntity(character.getEntity())
//             const entityJs = (entityMap as any).toJS()
//             const mention = entityJs.data.mention.toJS()
//             const entityRaw = {
//               type: entityJs.type,
//               mutability: entityJs.mutability,
//               data: {
//                 mention
//               }
//             }

//             selectedEntity = {
//               entityKey: character.getEntity(),
//               blockKey: block.getKey(),
//               entity: entityRaw
//             };
//             return true;
//           }
//         }
//         return false;
//       },
//       (start, end) => {
//         entities.push({ ...selectedEntity, start, end });
//       });
//   });
//   return entities;
// };

/*
const selection = new SelectionState({
  anchorKey: currentBlockKey,
  anchorOffset: selectionStart,
  focusKey: currentBlockKey,
  focusOffset: selectionEnd,
});

finalEditorState = modifier(finalEditorState, selection, ...args);
});

return EditorState.forceSelection(finalEditorState, currentSelection);
*/

interface Props {
}

interface State {
  selectionEditorState: EditorState
}

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const rawContent = {
      blocks: [
        {
          text: ('Hi this is the deafult text for the editor.'),
          type: 'unstyled',
          entityRanges: [
            {
              offset: 3,
              length: 4,
              key: 'first'
            },
            {
              offset: 15,
              length: 7,
              key: 'second'
            },
          ]
        },
      ],

      entityMap: {
        first: {
          type: 'TOKEN',
          mutability: 'IMMUTABLE',
        },
        second: {
          type: 'TOKEN',
          mutability: 'MUTABLE',
        },
      },
    }

    const contentState = convertFromRaw((rawContent as any) as RawDraftContentState)
    let editorState = EditorState.createWithContent(contentState)
    // const selectionState = new SelectionState({
    //   anchorKey: 'div',
    //   anchorOffset: 0,
    //   focusKey: 'div',
    //   focusOffset: 2,
    // })

    // editorState = EditorState.forceSelection(editorState, selectionState)

    // const newContentState = editorState.getCurrentContent();
    // const contentStateWithEntity = newContentState.createEntity(
    //   'LINK',
    //   'IMMUTABLE',
    //   {url: 'http://www.zombo.com'}
    // );
    // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    // const contentStateWithLink = Modifier.applyEntity(
    //   contentStateWithEntity,
    //   selectionState,
    //   entityKey
    // );

    // editorState = EditorState.createWithContent(contentStateWithLink)

    this.state = {
      selectionEditorState: editorState
    }
  }

  onChangeEditorState = (editorState: EditorState) => {
    this.setState({
      selectionEditorState: editorState
    })
  }

  render() {
    return (
      <section>
        <header className="subheader">
          <div className="container">
            <h1>Selection</h1>
            <h3>Requirements:</h3>
            <ul>
              <li>Load existing plain text string but add entities to text by regex.</li>
            </ul>
          </div>
        </header>

        <div className="container lists-grid">
          <div className="selection-editor">
            <Editor
              editorState={this.state.selectionEditorState}
              onChange={this.onChangeEditorState}
            />
          </div>
        </div>
      </section>
    )
  }
}
