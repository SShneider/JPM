import React, { Component } from 'react';
import { Table } from '@jpmorganchase/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
  graphId: number
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const perspectiveViewers = document.getElementsByTagName('perspective-viewer')
    const elem = perspectiveViewers[this.props.graphId] as unknown as PerspectiveViewerElement;

    const schema = {
      price_abc: 'float',
      price_def: 'float',
      ratio: 'float',
      timestamp: 'date',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float'
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      if(this.props.graphId===0){
        elem.setAttribute('view', 'y_line');
        elem.setAttribute('row-pivots', '["timestamp"]');
        elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
        elem.setAttribute('aggregates', JSON.stringify({
          price_abc: 'avg',
          price_def: 'avg',
          ratio: 'avg',
          timestamp: 'distinct count',
          upper_bound: 'avg',
          lower_bound: 'avg',
          trigger_alert: 'avg'
        }));
      }else if(this.props.graphId===1){
        elem.setAttribute('view', 'y_line');
        elem.setAttribute('row-pivots', '["timestamp"]');
        elem.setAttribute('columns', '["price_abc"]');
        elem.setAttribute('aggregates', JSON.stringify({
          price_abc: 'avg',
          timestamp: 'distinct count',
        }))
      }else if(this.props.graphId===2){
        elem.setAttribute('view', 'y_line');
        elem.setAttribute('row-pivots', '["timestamp"]');
        elem.setAttribute('columns', '["price_def"]');
        elem.setAttribute('aggregates', JSON.stringify({
          price_def: 'avg',
          timestamp: 'distinctcount',//both distinct count and distinct count are acceptable?
        }))
      }
    }
  }

  componentDidUpdate() {
    if (this.table && this.props && this.props.data && this.props.data.length) { //makes sure the graph wont try to render empty data
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ]);
    }
  }
}

export default Graph;
