import React, { ChangeEvent } from 'react';
import apiData from './apiData.json'
import './App.css';

export interface IState {
  formData: IPhase[] 
}

export interface IPhase {
  [phase: string]: ITask
}

interface ITask {
  [task: string]: IStatus
}

interface IStatus {
  [status: string]: string | boolean
}

interface IData {
  [key: string]: string[]
}

class App extends React.Component<IState, IState> {
  constructor(props: IState) {
    super(props);
    this.state = props;
  }

  handleChangePhase = (e: ChangeEvent<HTMLSelectElement>, rowIdx?: number) => {
    const { formData } = this.state;
    const data = apiData as IData;

    let newData = JSON.parse(JSON.stringify(formData));
    const defaultTask = data[e.target.value][0];
    const defaultStatus = {description: '', blocked: false, help: false};
    const newPhase = {[e.target.value]: {[defaultTask]: defaultStatus}};

    if (rowIdx !== undefined) {
      newData[rowIdx] = newPhase;
    } else {
      newData.push(newPhase);
    }
  
    this.setState({formData: newData});
  }
  
  handleChangeTask = (e: ChangeEvent<HTMLSelectElement>, rowIdx: number, phase: string) => {
    const { formData } = this.state;
    const defaultStatus = {description: '', blocked: false, help: false};

    let newData = JSON.parse(JSON.stringify(formData));
    newData[rowIdx][phase] = {
      [e.target.value]: defaultStatus
    };

    this.setState({formData: newData});
  }

  handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>, rowIdx: number, phase: string, task: string, status: string) => {
    const { formData } = this.state;

    let newData = JSON.parse(JSON.stringify(formData));
    newData[rowIdx][phase][task][status] = e.target.value;

    this.setState({formData: newData});
  }

  handleChangeStatus = (rowIdx: number, phase: string, task: string, status: string) => {
    const { formData } = this.state;

    let newData = JSON.parse(JSON.stringify(formData));
    newData[rowIdx][phase][task][status] = !newData[rowIdx][phase][task][status];

    this.setState({formData: newData});
  }

  renderNewRow() {
    const data = apiData as IData;
    
    return (
      <div className="row grid">
        <select id="new-phase" name="new-phase" value="-- Add Phase --" onChange={this.handleChangePhase}>  
          <option disabled>-- Add Phase --</option>
          {Object.keys(data).map(function(key: string, i: number) {
            return <option key={i}>{key}</option>
          })}
        </select>
      </div>
    )
  }

  renderRow = (rowData: IPhase, rowIdx: number) => {
    const data = apiData as IData;
    const rowPhase = Object.keys(rowData)[0];
    const rowTask = Object.keys(rowData[rowPhase])[0];
    const rowStatus = rowData[rowPhase][rowTask];
    const tasks = data[rowPhase];

    return (
      <div key={rowIdx} className="row grid">
        <select id={`phase-${rowIdx}`} className={`phase-${rowIdx}`} name="phase" value={rowPhase} onChange={(e) => this.handleChangePhase(e, rowIdx)}>
          {Object.keys(data).map(function(key: string, i: number) {
            return <option key={i}>{key}</option>
          })}
        </select>
        <select className={`task-${rowIdx}`} name="task" value={rowTask} onChange={(e) => this.handleChangeTask(e, rowIdx, rowPhase)}>
          {tasks.map(function(task: string, i: number) {
            return <option key={i}>{task}</option>
          })}
        </select>
        {rowTask && 
          <>
            <textarea className={`description-${rowIdx}`} style={{resize: "none"}} name="description" value={rowStatus.description as string} onChange={(e) => this.handleChangeDescription(e, rowIdx, rowPhase, rowTask, 'description')}/>
            <input className={`blocked-${rowIdx}`} type="checkbox" name="blocked" checked={rowStatus.blocked as boolean} onChange={(e) => this.handleChangeStatus(rowIdx, rowPhase, rowTask, 'blocked')}/>
            <input className={`checkbox-${rowIdx}`} type="checkbox" name="help" checked={rowStatus.help as boolean} onChange={(e) => this.handleChangeStatus(rowIdx, rowPhase, rowTask, 'help')}/>
          </>
        }
      </div>
    )
  } 

  render() {
    const { formData } = this.state

    return (
      <div className="App">
        <div className="labels grid">
          <label>Phase</label>
          <label>Task</label>
          <label>Description</label>
          <label>Blocked</label>
          <label>Help</label>
        </div>
        <form className="form">
          {formData.length > 0 && formData.map((rowData: IPhase, i: number) => this.renderRow(rowData, i))}
        </form>
        {this.renderNewRow()}
      </div>
    );
  }
}

export default App;
