import * as React from 'react'
import { Entity, ContentState } from 'draft-js'
import { IBlisCustomEntityData } from './models'
import CustomEntity from './CustomEntity'

/* Simulate entity component props which have children */
interface EntityComponentProps {
  entityKey: string
  contentState: ContentState
  children: any
}

interface Props extends EntityComponentProps{
  onClickDelete: (entity: Entity) => void
}

interface State {
  isEditing: boolean
}

export class CustomEntityContainer extends React.Component<Props, State> {
  state: State = {
    isEditing: false
  }

  onClickEdit = () => {
    console.log(`onClickEdit`)
    this.setState(prevState => ({
      isEditing: !prevState.isEditing
    }))
  }

  onClickDelete = () => {
    console.log(`onClickDelete`)
    this.setState({
      isEditing: false
    })
    const entity = this.props.contentState.getEntity(this.props.entityKey)
    this.props.onClickDelete(entity)
  }

  onClickComplete = () => {
    console.log(`onClickComplete`)
    this.setState({
      isEditing: false
    })
  }

  render() {
    const customEntityData: IBlisCustomEntityData = this.props.contentState.getEntity(this.props.entityKey).getData()
    const { option } = customEntityData
    
    return (
      <CustomEntity
        isEditing={this.state.isEditing}
        option={option}
        onClickEdit={this.onClickEdit}
        onClickDelete={this.onClickDelete}
        onClickComplete={this.onClickComplete}
      >
        {this.props.children}
      </CustomEntity>
    )
  }
}

export default CustomEntityContainer