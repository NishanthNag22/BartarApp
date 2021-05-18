import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class ExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      itemName: '',
      description: '',
      requestId: '',
      requestedItemName: '',
      itemStatus: '',
      docId: '',
      itemValue: '',
      currencyCode: '',
      isExchangeRequestActive: '',
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addItem = async (itemName, description) => {
    var userId = this.state.userId;
    var exchangeId = this.createUniqueId();
    console.log('im called', exchangeId);
    db.collection('exchangeRequests').add({
      emailId: userId,
      itemName: itemName,
      description: description,
      exchangeId: exchangeId,
      itemStatus: 'requested',
      itemValue: this.state.itemValue,
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getExchangeRequest();
    db.collection('users')
      .where('emailId', '==', userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isExchangeRequestActive: true,
          });
        });
      });

    this.setState({
      itemName: '',
      description: '',
      itemValue: '',
    });
    return alert('Item ready to exchange', '', [
      {
        text: 'OK',
        onPress: () => {
          this.props.navigation.navigate('Home');
        },
      },
    ]);
  };

  getIsExchangeRequestActive() {
    db.collection('users')
      .where('emailId', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            isExchangeRequestActive: doc.data().isExchangeRequestActive,
            userDocId: doc.id,
            currencyCode: doc.data().currencyCode,
          });
        });
      });
  }

  getExchangeRequest = () => {
    var exchangeRequest = db
      .collection('exchangeRequests')
      .where('emailId', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().itemStatus !== 'received') {
            this.setState({
              exchangeId: doc.data().exchangeId,
              requestedItemName: doc.data().itemName,
              itemStatus: doc.data().itemStatus,
              itemValue: doc.data().itemValue,
              docId: doc.id,
            });
          }
        });
      });
  };

  getData() {
    fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        var currencyCode = this.state.currencyCode;
        var currency = responseData.rates.INR;
        var value = 69 / currency;
        console.log(value);
      });
  }

  componentDidMount() {
    this.getExchangeRequest();
    this.getIsExchangeRequestActive();
    this.getData();
  }

  receivedItem = (itemName) => {
    var userId = this.state.userId;
    var exchangeId = this.state.exchangeId;
    db.collection('receivedItems').add({
      emailId: userId,
      itemName: itemName,
      exchangeId: exchangeId,
      itemStatus: 'received',
    });
  };

  updateExchangeRequestStatus = () => {
    db.collection('requestedRequests').doc(this.state.docId).update({
      itemStatus: 'recieved',
    });

    db.collection('users')
      .where('emailId', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('users').doc(doc.id).update({
            isExchangeRequestActive: false,
          });
        });
      });
  };
  
  sendNotification = () => {
    db.collection('users')
      .where('emailId', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var firstName = doc.data().firstName;
          var lastName = doc.data().lastName;
          db.collection('allNotifications')
            .where('exchangeId', '==', this.state.exchangeId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donorId;
                var itemName = doc.data().itemName;
                db.collection('allNotifications')({
                  targetedUserId: donorId,
                  message:
                    firstName +
                    ' ' +
                    lastName +
                    ' received the item ' +
                    itemName,
                  notificationStatus: 'unread',
                  itemName: itemName,
                });
              });
            });
        });
      });
  };

  render() {
    if (this.state.isExchangeRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Item Name</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text> Item Value </Text>
            <Text>{this.state.itemValue}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text> Item Status </Text>
            <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'orange',
              backgroundColor: 'orange',
              width: 300,
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateExchangeRequestStatus();
              this.receivedItem(this.state.requestedItemName);
            }}>
            <Text>I recieved the Item </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Add Item" navigation={this.props.navigation} />
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              style={styles.formTextInput}
              placeholder={'Item Name'}
              maxLength={8}
              onChangeText={(text) => {
                this.setState({
                  itemName: text,
                });
              }}
              value={this.state.itemName}
            />
            <TextInput
              multiline
              numberOfLines={4}
              style={[styles.formTextInput, { height: 100 }]}
              placeholder={'Description'}
              onChangeText={(text) => {
                this.setState({
                  description: text,
                });
              }}
              value={this.state.description}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder={'Item Value'}
              maxLength={8}
              onChangeText={(text) => {
                this.setState({
                  itemValue: text,
                });
              }}
              value={this.state.itemValue}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => {
                this.addItem(this.state.itemName, this.state.description);
              }}>
              <Text
                style={{ color: '#ffff', fontSize: 18, fontWeight: 'bold' }}>
                Add Item
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#FFAb91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: '75%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FF5722',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
