import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends Component {
    constructor() {
        super();
        this.state = {
            emailId: '',
            password: '',
            isModalVisible: false,
            firstName: '',
            lastName: '',
            mobileNumber: '',
            address: '',
            confirmPassword: '',
            currencyCode: '',
        };
    }

    userLogin = (emailId, password) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(emailId, password)
            .then(() => {
                this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                return alert(errorMessage);
            });
    };

    userSignUp = (emailId, password, confirmPassword) => {
        if (password !== confirmPassword) {
            return alert("password doesn't match\nCheck your password.");
        } else {
            firebase
                .auth()
                .createUserWithEmailAndPassword(emailId, password)
                .then((response) => {
                    db.collection('users').add({
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        contact: this.state.contact,
                        emailId: this.state.emailId,
                        address: this.state.address,
                        currencyCode: this.state.currencyCode,
                    });
                    return alert('User Added Successfully', '', [
                        {
                            text: 'OK',
                            onPress: () => this.setState({ isModalVisible: false }),
                        },
                    ]);
                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    return alert(errorMessage);
                });
        }
    };
    showModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isModalVisible}>
                <View style={styles.modalContainer}>
                    <ScrollView style={{ width: '100%' }}>
                        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
                            <Text style={styles.modalTitle}>Registration</Text>
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'First Name'}
                                maxLength={10}
                                onChangeText={(text) => {
                                    this.setState({
                                        firstName: text,
                                    });
                                }}
                            />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'Last Name'}
                                maxLength={10}
                                onChangeText={(text) => {
                                    this.setState({
                                        lastName: text,
                                    });
                                }}
                            />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'Contact'}
                                maxLength={10}
                                keyboardType={'numeric'}
                                onChangeText={(text) => {
                                    this.setState({
                                        contact: text,
                                    });
                                }}
                            />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'Address'}
                                multiline={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        address: text,
                                    });
                                }}
                            />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'Email'}
                                keyboardType={'email-address'}
                                onChangeText={(text) => {
                                    this.setState({
                                        emailId: text,
                                    });
                                }}
                            />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'Password'}
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        password: text,
                                    });
                                }}
                            />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'Confrim Password'}
                                secureTextEntry={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        confirmPassword: text,
                                    });
                                }}
                            />
                            <TextInput
                                style={styles.formTextInput}
                                placeholder={'Country currency code'}
                                maxLength={8}
                                onChangeText={(text) => {
                                    this.setState({
                                        currencyCode: text,
                                    });
                                }}
                            />
                            <View style={styles.modalBackButton}>
                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={() =>
                                        this.userSignUp(
                                            this.state.emailId,
                                            this.state.password,
                                            this.state.confirmPassword
                                        )
                                    }>
                                    <Text style={styles.registerButtonText}>Register</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBackButton}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => this.setState({ isModalVisible: false })}>
                                    <Text style={{ color: '#ff5722' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </Modal>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {this.showModal()}
                </View>
                <View style={styles.profileContainer}>
                    <Text style={styles.title}>Barter System</Text>
                    <Text style={styles.subTitle}> A Trading Method </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <TextInput
                            style={styles.loginBox}
                            placeholder={'Enter Email ID'}
                            keyboardType={'email-address'}
                            onChangeText={(text) => {
                                this.setState({
                                    emailId: text,
                                });
                            }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TextInput
                            style={styles.loginBox}
                            placeholder={'Enter Password'}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text,
                                });
                            }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            style={[styles.button, { marginTop: 20 }]}
                            onPress={() => {
                                this.userLogin(this.state.emailId, this.state.password);
                            }}>
                            <Text style={styles.buttonText}>LOGIN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { marginTop: 20 }]}
                            onPress={() => {
                                this.setState({ isVisible: true });
                            }}>
                            <Text style={styles.buttonText}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8BE85',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 45,
        fontWeight: '320',
        paddingBottom: 30,
        color: '#FF3D00',
    },
    subTitle: {
        fontSize: 20,
        marginTop: -20,
        marginLeft: 40,
    },
    buttonContainer: {
        flex: 0.45,
    },
    loginBox: {
        width: 300,
        height: 50,
        borderBottomWidth: 1.5,
        borderColor: '#FF8A65',
        fontSize: 20,
        paddingLeft: 10,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 30,
        color: '#FF5722',
        margin: 50,
    },
    modalContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: '#FFFF',
        marginRight: 30,
        marginLeft: 30,
        marginTop: 80,
        marginBottom: 80,
    },
    formTextInput: {
        width: '75%',
        height: 35,
        alignSelf: 'center',
        borderColor: '#FFAB91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10,
    },
    registerButton: {
        width: 200,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 30,
    },
    registerButtonText: {
        color: '#FF5722',
        fontSize: 15,
        fontWeight: 'bold',
    },
    cancelButton: {
        width: 200,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },

    button: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#FF9800',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10.32,
        elevation: 16,
        padding: 10,
    },
    buttonText: {
        color: '#',
        fontWeight: '200',
        fontSize: 20,
    },
});
