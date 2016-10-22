import React, { Component } from 'react'
import firebase, { messagesFromDatabase, signIn } from '../firebase';
import { pick, map, extend, filter, countBy, keyBy } from 'lodash';
import {SingleMessage} from './SingleMessage.jsx';
import {MessageFilter} from './MessageFilter.jsx';
import {UserList} from './UserList.jsx'
import Scroll from 'react-scroll'



export default class Messages extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      messagesCount: '',
      filteredMessages: []
    }
  }
  filterMessages(filterString) {
    this.setState ({filteredMessages: filter(this.state.messages, (message) => {
        return message.content.toLowerCase().includes(filterString.toLowerCase())
      })
    })
  }
  componentDidMount() {
    messagesFromDatabase.limitToLast(100).on('value', (snapshot) => {
      const messages = snapshot.val() || {};
      this.setState({
        messages: map(messages, (val, key) => extend(val, { key }))
      });
    });
  }
  componentDidUpdate() {
    var scroll = Scroll.animateScroll;
    scroll.scrollToBottom({
      duration: 0 //happen instantly
    });
  }
  render() {
    let userList;
    userList = keyBy(this.state.messages, 'user.displayName')
    console.log(userList)
    let userListArray = (Object.keys(userList))
    let userListDisplay;
    let userArray = [];

    userListArray.forEach((userName)=>{
      userArray.push(userList[userName].user)
    })

    if(userArray.length > 0){
      userListDisplay = <UserList userList={userArray}/>
    }

    return(
      <div>
      <header>
        <h1>Shoot The Breeze</h1>
        <MessageFilter filterFunction={this.filterMessages.bind(this)}/>
      </header>
      <ul className='messages-container'>
        { this.state.filteredMessages.length > 0 ?
          this.state.filteredMessages.map(m => <SingleMessage {...m} key={m.key}/>) : this.state.messages.map(m => <SingleMessage {...m} key={m.key}/>) }
      </ul>
        {userListDisplay}
      </div>
    )
  }
}
