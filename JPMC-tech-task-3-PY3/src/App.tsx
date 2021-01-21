import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';
//the toggle button i included in the last task seems to be causing an error 
//perspective DOMException: Failed to execute 'postMessage' on 'Worker': ArrayBuffer at index 0 is already detached
//we try to fix it

interface IState {
  data: ServerRespond[],
  updateGraph: boolean, 
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
      updateGraph: false, 
      //the graph is the centerpiece of our interface. 
      //seems like it would be more fitting to have the button toggle whether the requests to the api are active.
    };
  }

  renderGraph() {
      return (
      <div className="Graph">
        <div><Graph  data={this.state.data} graphId={0}/></div>
        <div>
          <Graph  data={this.state.data} graphId={1}/>
          <Graph  data={this.state.data} graphId={2}/>
        </div>
        
      </div>
      )
      //the ArrayBuffer bug was caused by trying to return more than one graph.
      //if i were to go back to exercise 2 i would change graphs visibility to hide it, not try to rerender multiple.
  }

  getDataFromServer() {
    let x = 0;
    if(!this.state.updateGraph){
      this.setState({updateGraph: true})
    }
    else{
      this.setState({updateGraph: false})
    }
    const interval = setInterval(()=>{
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ data: serverResponds});
       })
      x++;
      if(x>1000 || !this.state.updateGraph) clearInterval(interval)
    }, 100);
    
  }

  render() {
    let buttonClass = "btn btn-primary Stream-button"
    if(this.state.updateGraph) buttonClass = "btn btn-danger Stream-button"
    return (
      <div className="App">
        <header className="App-header">
          Bank Merge & Co Task 3
        </header>
        <div className="App-content">
          <button className={buttonClass} onClick={() => {this.getDataFromServer()}}>
          {this.state.updateGraph ? ("Stop Streaming Data") : ("Start Streaming Data")}</button>
          <div>
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
