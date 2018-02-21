import React from 'react'

import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import PauseModal from './PauseModal'

configure({ adapter: new Adapter() })

describe('<PauseModal />', () => {
  let wrapper = shallow(<PauseModal />)
  it('should render a template with one h4 and two buttons', () => {
    expect(wrapper.find('.container h4')).toHaveLength(1)
    expect(wrapper.find('.container button')).toHaveLength(2)
  })
})

describe('<PauseModal />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<PauseModal />)
  })

  it('should show with showModal prop', () => {
    wrapper.setProps({showModal: true})
    expect(wrapper.find('.PauseModal').hasClass('show')).toBeTruthy()
  })

  it('should not show without showModal prop', () => {
    expect(wrapper.find('.PauseModal').hasClass('show')).toBeFalsy()
  })
})
