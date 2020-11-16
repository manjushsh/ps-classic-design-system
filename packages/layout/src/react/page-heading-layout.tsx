import { HTMLPropsFor } from '@pluralsight/ps-design-system-util'
import { compose, css, media } from 'glamor'
import { Heading } from '@pluralsight/ps-design-system-text'
import React from 'react'

import { pageHeadingLayoutCSS as stylesheet } from '../css'

const styles = {
  actions: () => {
    const label = 'psds-page-heading-layout__actions'

    return compose(
      css(stylesheet[`.${label}`]),

      media(
        '(min-width: 769px)',
        css(stylesheet['@media (min-width: 769px)'][`.${label}`])
      )
    )
  },
  heading: () => {
    const label = 'psds-page-heading-layout__heading'

    return compose(
      css(stylesheet[`.${label}`]),

      media(
        '(min-width: 769px)',
        css(stylesheet['@media (min-width: 769px)'][`.${label}`])
      )
    )
  },
  layout: () => css(stylesheet['.psds-page-heading-layout'])
}

interface PageHeadingLayoutProps extends HTMLPropsFor<'div'> {
  actions?: React.ReactNode[]
  heading: React.ReactNode
}
const PageHeadingLayout: React.FC<PageHeadingLayoutProps> = props => {
  const { actions = [], heading } = props
  return (
    <div {...styles.layout()}>
      <div {...styles.heading()}>
        <Heading size={Heading.sizes.large}>{heading}</Heading>
        {Array.isArray(actions) && actions.length > 0 && (
          <div {...styles.actions()}>{actions}</div>
        )}
      </div>
      {props.children}
    </div>
  )
}

export default PageHeadingLayout
