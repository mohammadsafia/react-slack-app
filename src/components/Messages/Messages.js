import React, { Component } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";

import firebase from "../../firebase";
import Message from "./Message";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoding: false,
    searchResults: [],
  };

  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListner(channelId);
  };

  addMessageListner = (channelId) => {
    let loadedMessage = [];
    this.state.messagesRef.child(channelId).on("child_added", (snap) => {
      loadedMessage.push(snap.val());

      this.setState({ messages: loadedMessage, messagesLoading: false });

      this.countUniqueUsers(loadedMessage);
    });
  };

  countUniqueUsers = (messages) => {
    const unigueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = unigueUsers.length > 1 || unigueUsers.length === 0;
    const numUniqueUsers = `${unigueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
  };
  displayMessage = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));
  displayChannelName = (channel) => (channel ? `${channel.name}` : "");

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value, searchLoding: true }, () => {
      this.handleSearchMessages();
    });
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (message.content && message.content.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);

    this.setState({ searchResults });
    setTimeout(() => {
      this.setState({ searchLoding: false });
    }, 1000);
  };
  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniqueUsers,
      searchResults,
      searchTerm,
      searchLoding,
    } = this.state;
    return (
      <React.Fragment>
        <MessageHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoding={searchLoding}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessage(searchResults)
              : this.displayMessage(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          currentChannel={channel}
          messagesRef={messagesRef}
          currentUser={user}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
