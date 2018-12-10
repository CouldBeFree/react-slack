import React from 'react';
import firebase from '../../firebase';
import uuidv4 from 'uuid/v4';
import FileModal from './FileModal';
import { Segment, Button, Input } from 'semantic-ui-react';

class MessageForm extends React.Component {
    state = {
        storageRef: firebase.storage().ref(),
        message: '',
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        messageRef: this.props.messageRef,
        loading: false,
        errors: [],
        modal: false,
        uploadTask: null,
        uploadState: '',
        percentUploaded: 0
    };

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        };

        if(fileUrl !== null){
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message;
        }

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

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messageRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;

        this.setState({
                uploadState: 'uploading',
                uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
            },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        this.setState({ percentUploaded })
                    },
                    err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                            this.sendFileMessage(downloadUrl, ref, pathToUpload);
                        })
                            .catch(err => {
                                console.error(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error',
                                    uploadTask: null
                                })
                            })
                    }
                )
            }
        )
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                })
            })
    };

    render(){
        const { errors, message, loading, modal } = this.state;

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
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
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
                        onClick={this.openModal}
                    />
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm;