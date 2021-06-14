import { convertStoriesToJestCases } from '@pluralsight/ps-design-system-util'
import { screen, render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Carousel from '../index'
import * as stories from '../__stories__/index.story'
import * as vars from '../../vars/index'

describe('Carousel', () => {
  const cases = convertStoriesToJestCases(stories)

  it('exports sizes', () => {
    expect(Carousel.sizes).toEqual(vars.sizes)
  })

  it('exports a Control component', () => {
    expect(Carousel.Control).toBeDefined()
  })

  describe('with a single item', () => {
    beforeEach(() => {
      render(
        <Carousel>
          <Carousel.Item>
            <div />
          </Carousel.Item>
        </Carousel>
      )
    })

    it('hides the prev control', () => {
      const prev = screen.queryByRole('button', { name: /Previous items/ })
      expect(prev).not.toBeInTheDocument()
    })

    it('hides the next control', () => {
      const next = screen.queryByRole('button', { name: /Next items/ })
      expect(next).not.toBeInTheDocument()
    })
  })

  describe('when on the first page', () => {
    let container: Element

    beforeEach(() => {
      const { container: _container } = render(
        <Carousel>
          <Carousel.Item>
            <div />
          </Carousel.Item>
          <Carousel.Item>
            <div />
          </Carousel.Item>
          <Carousel.Item>
            <div />
          </Carousel.Item>
          <Carousel.Item>
            <div />
          </Carousel.Item>
          <Carousel.Item>
            <div />
          </Carousel.Item>
          <Carousel.Item>
            <div />
          </Carousel.Item>
          <Carousel.Item>
            <div />
          </Carousel.Item>
        </Carousel>
      )
      container = _container
    })

    it('shows the next control', () => {
      const next = screen.getByRole('button', { name: /Next items/ })
      expect(next.parentElement).not.toHaveAttribute('hidden')
    })

    it('hides the prev control', () => {
      const prev = screen.queryByRole('button', { name: /Previous items/ })
      expect(prev).not.toBeInTheDocument()
    })
  })

  describe.each(cases)('%s story', (_name, Story) => {
    it('has no axe-core violations', async () => {
      const { container } = render(<Story {...Story.args} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
