import  React  from 'react';
import  ReactDOM  from 'react-dom';
import  ee  from 'event-emitter';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

let app = document.querySelector('#hello'),
  emitter = ee({}), 
  listener,
  tasks = [
    {
      id: 0,
      name: 'task1',
      check: false
    },
    {
      id: 1,
      name: 'task2',
      check: false
    },
    {
      id: 2,
      name: 'task3',
      check: false
    },
    {
      id: 3,
      name: 'task4',
      check: false
    },
  ];

class Tasks extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      check: false
    }
  }
  OnCheck(){
    this.setState({ check: !this.state.check })
  }
  del(i){
    emitter.emit('deleted', i);
  }
  render(){
    return(
      <div>
            <label className={ this.state.check ? 'selected' : '' }>{this.props.data.name}
              <input
                onChange={this.OnCheck.bind(this)} 
                type='checkbox'
                checked={this.state.check ? true : false } />
            </label>
            <a onClick={this.del.bind(this, this.props.data.id)} href='#' className='del'></a>
      </div>
    )
  }
}

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: tasks,
      id: 4
    }
  }
  componentDidMount() {
    emitter.on('deleted', listener = id =>{
      let newData = this.state.data.filter((item, i) => item.id == id ? false : item)
      this.setState({data: newData})
    })
  }
  add(){
      let newData = this.state.data.map(item => item)
      newData.push({
        name: ReactDOM.findDOMNode(this.refs.input).value,
        check: false,
        id: this.state.id
      })
      this.setState({
        data: newData,
        id: ++this.state.id
      })
  }
  render(){
    return(
        <div>
          <input ref='input'/>
          <button onClick={this.add.bind(this)}>Add</button>
          {this.state.data.map((item, i) => (
            <Tasks key={item.id} data={item}  />
            ))
          }
        </div>
        );
  }
}
class MainApp extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      countOfBoards: [' '],
      id: 0
    }
  }
  add(){
    let newArr = this.state.countOfBoards.map(item => item)
    newArr.push(' ')
    this.setState({
      countOfBoards: newArr,
      id: ++this.state.id
    })
  }
  render(){
    return(
      <div>
        <div>
          {this.state.countOfBoards.map((item,i) => (
                  <App key={i+this.state.id}/>
                  ))}
        </div>
        <button onClick={this.add.bind(this)}>AddBoard</button>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={MainApp}/>
  </Router>
  ,app
);

