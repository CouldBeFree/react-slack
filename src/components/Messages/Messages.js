import React from 'react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

class Messages extends React.Component {
    state = {
        messageRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser
    };

    render(){
        const { messageRef, channel, user } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                        {/* Messages */}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={messageRef}
                    currentChannel={channel}
                    currentUser={user}
                />
            </React.Fragment>
        )
    }
}

export default Messages;