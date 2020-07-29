import { compose, css } from 'glamor'
import polyfillFocusWithin from 'focus-within'
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'

import Button from '@pluralsight/ps-design-system-button'
import filterReactProps from '@pluralsight/ps-design-system-filter-react-props'
import Theme, {
  names as themes,
  useTheme
} from '@pluralsight/ps-design-system-theme'

import stylesheet from '../css/index.js'
import * as vars from '../vars/index.js'

import useBodyScrollLock from './use-body-scroll-lock.js'
import useMatchMedia from './use-match-media.js'

if (typeof window !== 'undefined') polyfillFocusWithin(document)

const styles = {
  frame: (themeName, _props) =>
    compose(
      css(stylesheet['.psds-frame']),
      css(stylesheet[`.psds-frame.psds-theme--${themeName}`])
    ),

  skipBanner: () => css(stylesheet['.psds-frame__skip-banner']),

  container: variant =>
    compose(
      css(stylesheet['.psds-frame__container']),
      variant && css(stylesheet[`.psds-frame__container--${variant}`])
    ),
  content: () => css(stylesheet['.psds-frame__content']),
  sidenav: variant =>
    compose(
      css(stylesheet['.psds-frame__sidenav']),
      variant && css(stylesheet[`.psds-frame__sidenav--${variant}`])
    ),
  sidenavInner: () => css(stylesheet['.psds-frame__sidenav__inner']),
  topnav: () => css(stylesheet['.psds-frame__topnav'])
}

const Frame = React.forwardRef((props, forwardedRef) => {
  const { children, sidenav, sidenavOpen = false, topnav } = props

  const ref = React.useRef()
  useImperativeHandle(forwardedRef, () => ref.current)

  const tabletPlus = useMatchMedia(`(min-width: ${vars.breakpoints.medium})`)
  const themeName = useTheme()

  const variant = useMemo(() => {
    const { sidenavVariants: variants } = vars

    if (!sidenav) return variants.closed

    let nextVariant = sidenavOpen ? variants.open : variants.closed

    if (!tabletPlus && sidenavOpen) nextVariant = variants.overlay
    if (tabletPlus && !sidenavOpen) nextVariant = variants.minimized

    return nextVariant
  }, [sidenav, sidenavOpen, tabletPlus])

  const skipTargetId = 'ps-frame-skip-target'
  const skipTargetRef = useRef()

  const focusSkipTarget = useCallback(() => {
    if (!skipTargetRef.current) return

    skipTargetRef.current.focus()
  }, [])

  const meta = { mobile: !tabletPlus, skipTargetId }

  return (
    <div
      ref={ref}
      {...styles.frame(themeName, props)}
      {...filterReactProps(props)}
    >
      <Theme name={themes.dark}>
        <SkipBanner href={'#' + skipTargetId} />
      </Theme>

      <Theme name={themes.dark}>
        <div {...styles.topnav()}>
          {isFunction(topnav) ? topnav(meta) : topnav}
        </div>
      </Theme>

      <Container variant={variant}>
        {sidenav && (
          <SideNav variant={variant}>
            {isFunction(sidenav) ? sidenav(meta) : sidenav}
          </SideNav>
        )}

        <main {...styles.content()}>
          <SkipTarget
            id={skipTargetId}
            onClick={focusSkipTarget}
            ref={skipTargetRef}
          />

          {isFunction(children) ? children(meta) : children}
        </main>
      </Container>
    </div>
  )
})

Frame.displayName = 'Frame'

Frame.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  sidenav: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  sidenavOpen: PropTypes.bool,
  topnav: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
}

function SkipBanner(props) {
  return (
    <div {...styles.skipBanner()} {...props}>
      <Button
        appearance={Button.appearances.secondary}
        size={Button.sizes.small}
        tabIndex={0}
      >
        skip to main content
      </Button>
    </div>
  )
}
SkipBanner.propTypes = {
  href: PropTypes.string.isRequired
}

const SkipTarget = React.forwardRef((props, ref) => {
  return <a ref={ref} tabIndex={-1} {...props} />
})
SkipTarget.displayName = 'SkipTarget'
SkipTarget.propTypes = {
  id: PropTypes.string.isRequired
}

function Container(props) {
  const { variant, ...rest } = props

  return <div {...styles.container(variant)} {...rest} />
}
Container.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(Object.keys(vars.sidenavVariants))
}

function SideNav(props) {
  const { children, variant, ...rest } = props
  const ref = React.useRef()

  const lockScroll = variant === vars.sidenavVariants.overlay
  useBodyScrollLock(ref, lockScroll)

  return (
    <Theme name={themes.dark}>
      <div ref={ref} {...styles.sidenav(variant)} {...rest}>
        <div {...styles.sidenavInner()}>{children}</div>
      </div>
    </Theme>
  )
}
SideNav.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(Object.keys(vars.sidenavVariants))
}

function isFunction(fn) {
  return typeof fn === 'function'
}

export default Frame
