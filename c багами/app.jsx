import  React  from 'react';
import  ReactDOM  from 'react-dom';
import  ee  from 'event-emitter';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

let app = document.querySelector('#hello'),
  emitter = ee({}), 
  listener,
  tasks = ['task1', 'task2', 'task3'];

class ProgressStatus extends React.Component{
  render(){
    return(
      <div>
        <p>
          {this.props.lengthOfChecked} of { this.props.length}
        </p>
      </div>
    )
  }
}

class Task extends React.Component{
  onLabel(e){
    e.target.parentNode.classList.toggle('selected')
    let data = document.querySelectorAll('[type="checkbox"]:checked').length
    emitter.emit('checkedData', data)
  }
  onDel(i){
    emitter.emit('targetForDelete', i)
    let data = document.querySelectorAll('[type="checkbox"]:checked').length
    emitter.emit('checkedData', data)
  }
  render(){
    return(
      <div>
          {this.props.data.map((item, i) =>(
            <div key={i} >
              <p>
                <label > 
                    {item}
                    <input 
                      onClick={this.onLabel.bind(this)} 
                      type='checkbox'
                      ref='checkbox'/>
                </label>
                <a href='#' onClick={this.onDel.bind(this, i)} data-id={ i } className='del'></a>
              </p>
            </div>
            ))
          
          }
      </div>
    );
  }
};
class App extends React.Component {
  constructor() {
    {
      super();
      this.state = {
        data: tasks,
        dataCh: 0
      }
    }
  }
  componentDidMount() {
    emitter.on('targetForDelete', listener =  i => {
      let dataAfterDelTask = this.state.data.filter((item, index) => i == index ? false : item)
      this.setState({data: dataAfterDelTask})
    });
    emitter.on('checkedData', listener =  length => {
      this.setState({dataCh: length})
    });
  }
  addTask(e){
    let data = ReactDOM.findDOMNode(this.refs.newTask)
    let newData = this.state.data.map(item => item)
    newData.push(data.value)
    this.setState({data: newData})
    data.value = ''
  }
  render(){
    return(
      <div className='toDo'>
        <h1>ToDd</h1>
        <ProgressStatus length={ this.state.data.length } lengthOfChecked={ this.state.dataCh } />
        <Task data={this.state.data} />
        <input type='text' ref='newTask'/>
        <button onClick={ this.addTask.bind(this) }>Add</button>
      </div>

    );
  }
};

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
  </Router>
  ,app
);

