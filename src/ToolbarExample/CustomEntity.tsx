import * as React from 'react'
import { IOption } from './models'
import './CustomEntity.css'

/* Simulate entity component props which have children */
interface EntityComponentProps {
  children?: any
}

interface Props extends EntityComponentProps {
  option: IOption
  isEditing: boolean
  onClickEdit: () => void
  onClickDelete: () => void
  onClickComplete: () => void
}

export const CustomEntity = (props: Props) => {
  const { option, isEditing } = props
  console.log(`CustomEntity.data: `, option)
  return (
    <span className={`blis-custom-entity ${isEditing ? 'blis-custom-entity--is-editing' : ''}`}>
      <div className="blis-custom-entity-indicator">
        <div className="blis-custom-entity-indicator__buttons">
          {!isEditing
            ? <button type="button" onClick={props.onClickEdit}>&#9998;</button>
            : (
              <div>
                <button type="button" onClick={props.onClickDelete}>&#10006;</button>
                <button type="button" onClick={props.onClickComplete}>&#10004;</button>
              </div>
            )
          }
        </div>
        <div className="blis-custom-entity-indicator__name">
          {option.name}
        </div>
        <div className="blis-custom-entity-indicator__bracket">
        </div>
      </div>
      <span className="blis-custom-entity__text">
        {props.children}
      </span>
    </span>
  )
}

export default CustomEntity