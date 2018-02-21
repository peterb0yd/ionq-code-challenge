import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import { jobStatus } from '../../../config'

import Job from './Job'

configure({ adapter: new Adapter() })

describe('<Job />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Job />)
  })

  it('should blink if in progress', () => {
    wrapper.setState({blinking: true})
    expect(wrapper.find('.Job').hasClass('blinking')).toBeTruthy()
  })

  it('should be blue if in progress', () => {
    wrapper.setProps({jobStatus: jobStatus.IN_PROGRESS})
    expect(wrapper.find('.Job').hasClass(jobStatus.IN_PROGRESS)).toBeFalsy()
  })

  it('should be grayed if in queued', () => {
    wrapper.setProps({jobStatus: jobStatus.QUEUED})
    expect(wrapper.find('.Job').hasClass(jobStatus.QUEUED)).toBeFalsy()
  })
})
