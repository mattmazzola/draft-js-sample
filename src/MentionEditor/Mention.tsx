import * as React from 'react'

export const CustomMention = ({ children, className }: any) => (
  <span
    className={className}
    spellCheck={false}
  >
    {children}
  </span>
)

export default CustomMention