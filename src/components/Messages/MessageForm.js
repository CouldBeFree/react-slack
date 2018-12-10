import React from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

class MessageForm extends React.Component {
    state = {
        message: '',
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        messageRef: this.props.messageRef,
        loading: false,
        errors: []
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };
        return message;
    };

    sendMessage = () => {
        const { messageRef } = this.props;
        const { message, channel } = this.state;

        if(message) {
            this.setState({
                loading: true
            });
            messageRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({
                        loading: false,
                        message: '',
                        errors: []
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    };
/*
    componentDidMount() {
        const { channel, user } = this.state;

        if(channel && user) {
            this.addListeners(channel.id)
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    };

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messageRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
        })
    };*/

    render(){
        const { errors, message, loading } = this.state;

        return (
            <Segment className="message__form">
                <Input
                    onChange={this.handleChange}
                    value={message}
                    fluid
                    name="message"
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="Write your message"
                    className={
                        errors.some(error => error.includes('message')) ? 'error' : ''
                    }
                />
                <Button.Group icon widths="2">
                    <Button
                        onClick={this.sendMessage}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        disabled={loading}
                    />
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm;