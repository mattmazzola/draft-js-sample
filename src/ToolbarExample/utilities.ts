import { SelectionState } from 'draft-js'

export const getSelectionStateDate = (selectionState: SelectionState) =>
  ({
    anchorKey: selectionState.getAnchorKey(),
    anchorOffset: selectionState.getAnchorOffset(),
    focusKey: selectionState.getFocusKey(),
    focusOffset: selectionState.getFocusOffset(),
    endKey: selectionState.getEndKey(),
    endOffset: selectionState.getEndOffset(),
    startKey: selectionState.getStartKey(),
    startOffset: selectionState.getStartOffset()
  })