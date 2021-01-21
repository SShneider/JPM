import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';


configure({adapter: new Adapter()});

const shallowApp = shallow(<App/>)
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it('renders toggle button', ()=>{
  expect(shallowApp.find(".btn").at(0).text()).toBe("Start Streaming Data")
})
it('Changes button text to "stop streaming" and changes state to update: true', ()=>{
  shallowApp.find(".btn").at(0).simulate("click")
  expect(shallowApp.find(".btn").at(0).text()).toBe("Stop Streaming Data")
  expect(shallowApp.state('updateGraph')).toBe(true)
})
it('Changes button text to "start streaming" and changes state to update: false', ()=>{
  shallowApp.find(".btn").at(0).simulate("click")
  expect(shallowApp.find(".btn").at(0).text()).toBe("Start Streaming Data")
  expect(shallowApp.state('updateGraph')).toBe(false)
})


