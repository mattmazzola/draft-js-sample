import { SelectionState } from 'draft-js'
export const customEntityType = 'blis-entity-custom'
export const preBuildEntityType = 'blis-entity-pre-built'

export interface Position {
  top: number
  bottom: number
  left: number
}

export interface IOption {
  id: string
  name: string
}

export interface IBlisCustomEntityData {
  option: IOption
  selectionState: SelectionState
}