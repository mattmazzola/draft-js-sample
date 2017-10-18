import * as React from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import mentions, { IMention } from './mentions'
import './App.css'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'

interface Props {
}

interface State {
  editorState: EditorState,
  suggestions: IMention[]
}

const getEntities = (editorState: EditorState, entityType: string | null = null): any[] => {
  const content = editorState.getCurrentContent();
  const entities: any = [];
  content.getBlocksAsArray().forEach((block) => {
    let selectedEntity: any = null;
    block.findEntityRanges(
      (character) => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            const entityMap = content.getEntity(character.getEntity())
            const entityJs = (entityMap as any).toJS()
            const mention = entityJs.data.mention.toJS()
            const entityRaw = {
              type: entityJs.type,
              mutability: entityJs.mutability,
              data: {
                mention
              }
            }

            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: entityRaw
            };
            return true;
          }
        }
        return false;
      },
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      });
  });
  return entities;
};

class App extends React.Component<Props, State> {
  domEditor: any
  mentionPlugin: any

  state = {
    editorState: EditorState.createEmpty(),
    suggestions: mentions
  }

  constructor(props: Props) {
    super(props);

    this.mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '$',
      mentionTrigger: '$'
    });
  }

  setDomEditorRef = (ref: any) => this.domEditor = ref

  onChange = (editorState: EditorState) => {
    this.setState({
      editorState
    })
  }

  onSearchChange = ({ value }: { value: string }) => {
    const entities = getEntities(this.state.editorState, '$mention')
    const existingEntityIds = entities.map(e => e.entity.data.mention.id)
    const filteredMentions = mentions.filter(m => !existingEntityIds.includes(m.id))
    this.setState({
      suggestions: defaultSuggestionsFilter(value, filteredMentions),
    })
  }

  onClickEditorContainer = () => {
    this.domEditor.focus()
  }

  render() {
    const { MentionSuggestions } = this.mentionPlugin
    const plugins = [this.mentionPlugin]

    return (
      <div id="content">
        <h1>Draft.js Editor</h1>

        <div className="editor" onClick={this.onClickEditorContainer}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={this.setDomEditorRef}
          />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
          />
        </div>
      </div>
    );
  }
}

export default App;
