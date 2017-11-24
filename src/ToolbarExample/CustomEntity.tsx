import * as React from 'react'
import './CustomEntity.css'

export const CustomEntity = (props: any) => {
  const data = props.contentState.getEntity(props.entityKey).getData()
  console.log(`CustomEntity.data: `, data)
  return (
    <span className="blis-custom-entity">
      {props.children}
    </span>
  )
}

export default CustomEntity