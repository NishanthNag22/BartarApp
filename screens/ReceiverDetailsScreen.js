import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';

export default class ReceiverDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            userName: '',
            receiverId: this.props.navigation.getParam('details')["emailId"],
            exchangeId: this.props.navigation.getParam('details')["exchangeId"],
            itemName: this.props.navigation.getParam('details')["itemName"],
            description: this.props.navigation.getParam('details')["description"],
            receiverName: '',
            receiverContact: '',
            receiverAddress: '',
            receiverRequestDocId: ''
        };
    }

    getReceiverDetails = () => {
        db.collection('users').where('emailId', '==', this.state.receiverId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        receiverName: doc.data().firstName,
                        receiverContact: doc.data().contact,
                        receiverAddress: doc.data().address,
                    });
                });
            });
        db.collection('exchangeRequests').where('exchangrId', '==', this.state.exchangeId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({ receiverRequestDocId: doc.id });
                });
            });
    }

    updateBarterStatus = () => {
        db.collection('allBarters').add({
            itemName: this.state.itemName,
            exchangeId: this.state.exchangeId,
            requestedBy: this.state.receiverName,
            donorId: this.state.userId,
            requestStatus: 'Donor Interested',
        });
    };

    addNotification = () => {
        console.log("Line No.54")
        var message =
            this.state.userName + ' has shown interest in exchanging the item';
        db.collection('allNotifications').add({
            targetedUserId: this.state.receiverId,
            donorId: this.state.userId,
            exchangeId: this.state.exchangeId,
            itemName: this.state.itemName,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            notificationStatus: 'unread',
            message: message,
        });
    };

    componentDidMount() {
        console.log("Line No:70");
        this.getReceiverDetails()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.1 }}>
                    <Header
                        leftComponent={<Icon name="arrow-left" type="feather" color="#ffff" onPress={() => this.props.navigation.goBack()} />}
                        centerComponent={{ text: 'Exchange Items', style: { color: '#ffff', fontSize: 20, fontWeight: 'bold' } }}
                        backgroundColor="#EAF8FE"
                    />
                </View>
                <View style={{ flex: 0.5 }}>
                    <Card
                        title={'Item Information'}
                        titleStyle={{ fontSize: 20 }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Name : {this.state.itemName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Reason : {this.state.description}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={{ flex: 0.4 }}>
                    <Card
                        title={'Receiver Information'}
                        titleStyle={{ fontSize: 20 }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Name: {this.state.receiverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Contact: {this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Address: {this.state.receiverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={styles.buttonContainer}>
                    {
                        this.state.receiverId !== this.state.userId
                            ? (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        this.updateBarterStatus();
                                        this.addNotification();
                                        this.props.navigation.navigate('BartersList')
                                        this.props.navigation.navigate('MyBarters');
                                    }}>
                                    <Text style={{ color: '#ffff' }}>I want to Exchange</Text>
                                </TouchableOpacity>
                            )
                            : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    button: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#32867d',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        elevation: 16,
    },
});