import React, { Component } from "react";

import { Menu, Icon } from "semantic-ui-react";

import firebase from "../../firebase";

import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";

import { connect } from "react-redux";
class DirectMessages extends Component {
  state = {
    users: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
  };
  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = (currentUserId) => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", (snap) => {
      if (currentUserId !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;

        user["status"] = "offline";

        loadedUsers.push(user);

        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    this.state.presenceRef.on("child_added", (snap) => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on("child_removed", (snap) => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updateUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);

    this.setState({ users: updateUsers });
  };

  isUserOnline = (user) => user.status === "online";

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);

    const channelData = {
      id: channelId,
      name: user.name,
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
  };

  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };
  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {/* Users to Send Direct Messages */}

        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}
const mapDispatchToProps = {
  setCurrentChannel: setCurrentChannel,
  setPrivateChannel: setPrivateChannel,
};
export default connect(null, mapDispatchToProps)(DirectMessages);
