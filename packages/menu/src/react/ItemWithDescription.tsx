import {
  classNames,
  forwardRefWithAs
} from '@pluralsight/ps-design-system-util'
import React from 'react'

import '../css/index.css'
import Menu, { MenuItemProps } from './index'

interface MenuItemWithDescriptionProps extends Omit<MenuItemProps, 'value'> {
  label: React.ReactText
  value: React.ReactText
  description: React.ReactText
}

export const MenuItemWithDescription = forwardRefWithAs<
  MenuItemWithDescriptionProps,
  'button'
>((props, ref) => {
  const { className, label, value, description, ...rest } = props
  return (
    <Menu.Item
      {...rest}
      ref={ref}
      value={{ label, value }}
      className={classNames('psds-menu__item-with-description', className)}
    >
      <div className="psds-menu__item-with-description__wrapper">
        <span>{label}</span>
        <span className="psds-menu__item-with-description__description">
          {description}
        </span>
      </div>
      <Menu.Check style={{ marginLeft: 'auto' }} />
    </Menu.Item>
  )
})
