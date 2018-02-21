import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import { configure, shallow } from 'enzyme'
import { jobStatus } from '../../config'

import Jobs from './Jobs'

configure({ adapter: new Adapter() })

describe('<Jobs />', () => {
  let wrapper = shallow(<Jobs />)

  // beforeEach(() => {
  //   wrapper = shallow(<Jobs />)
  // })

  it('should show a card for each job', () => {
    /*** This prop isn't being sent for some reason
    **** which causes this test to fail - still investigating
    */
    const jobs = [
      { id: 1, status: jobStatus.IN_PROGRESS, name: 'test', program: 'test', submissionTime: new Date() },
      { id: 2, status: jobStatus.QUEUED, name: 'test', program: 'test', submissionTime: new Date() },
      { id: 3, status: jobStatus.QUEUED, name: 'test', program: 'test', submissionTime: new Date() }
    ]
    wrapper.setProps({ jobs }, () => {
      expect(wrapper.find(<Job />)).toHaveLength(3)
    })
  })
})
