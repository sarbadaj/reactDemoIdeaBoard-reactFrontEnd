import React, { Component } from 'react'
import axios from 'axios'
import Idea from './Idea'
import update from 'immutability-helper'
import IdeaForm from './IdeaForm'

class IdeasContainer extends Component {


  addNewIdea=()=> {
    axios.post(
      'http://localhost:3001/api/v1/ideas.json',
      { idea:
        {
          title: '',
          body: ''
        }
      }
    )
    .then(response => {
      const ideas = update(this.state.ideas, {
        $splice: [[0, 0, response.data]]
      })
      this.setState({
        ideas: ideas,
        editingIdeaId: response.data.id
      })
    })
    .catch(error => console.log(error))
  }

  updateIdea = (idea) => {
    const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id)
    const ideas = update(this.state.ideas, {
      [ideaIndex]: { $set: idea }
    })
  }

  resetNotification = () => {
    this.setState({ notification: '' })
  }

  enableEditing = (id) => {
    this.setState({editingIdeaId: id})
  }

  constructor(props) {
    super(props)
    this.state = {
      ideas: [],
      editingIdeaId: null,
      notification: ''
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/v1/ideas.json')
    .then(response => {
      console.log(response)
      this.setState({ideas: response.data,
                     notification: 'All changes have been saved.'})

    })
    .catch(error => console.log(error))
  }


  render() {
    return (
      <div>
        <button className="newIdeaButton" onClick={this.addNewIdea} >
          New Idea
        </button>
        <span className="notification">
          {this.state.notification}
        </span>
        {this.state.ideas.map((idea) => {
          if(this.state.editingIdeaId === idea.id) {
            return(<IdeaForm idea={idea} key={idea.id} updateIdea={this.updateIdea} resetNotification={this.resetNotification} 
                    titleRef= {input => this.title = input}/>)
          } else {
            return (<Idea idea={idea} key={idea.id} onClick={this.enableEditing} />)
          }
        })}
      </div>
    );
  }
}

export default IdeasContainer