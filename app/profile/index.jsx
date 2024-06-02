import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
// import { Link } from 'expo-router'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../../utils/config';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ColorContext } from '../../utils/ColorContext'

const index = () => {
    const navigation = useNavigation();
    const [user, setuser] = useState()
    const { selectedColor, handleColorChange, COLOR_OPTIONS } = useContext(ColorContext);

    async function GetUser() {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        axios.get(`${config.baseurl}/user`, { headers: headers })
            .then((res) => {

                setuser(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {
        GetUser()
    }, [])
    return (
        <>
            <LinearGradient colors={[selectedColor, selectedColor]}>
                <View style={styles.titlecontainer}>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.Pagetitle}>My Profile</Text>

                </View>
            </LinearGradient>

            {user &&
                <>
                    <View>
                        <View style={styles.usernameview}>
                            <FontAwesome name="user" size={24} color="black" />
                            <Text style={styles.textuser}>{user.username}</Text>
                        </View>
                        <View style={styles.usernameview}>
                            <MaterialIcons name="mail" size={24} color="black" />
                            <Text style={styles.textuser}>{user.email}</Text>
                        </View>

                    </View>
                </>
            }
            <View>
                <View style={[styles.container]}>
                    <Text style={styles.title}>Profile Page</Text>
                    <Text style={styles.subtitle}>Select a Color:</Text>
                    <View style={styles.buttonContainer}>
                        {COLOR_OPTIONS.map((color) => (
                            <Button
                                key={color}
                                title="Select"
                                color={color}
                                onPress={() => handleColorChange(color)}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </>
    )
}



const styles = StyleSheet.create({

    titlecontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    Pagetitle: {
        fontSize: 25,
        padding: 10,
        fontWeight: 'bold',
        paddingTop: StatusBar.currentHeight + 25,
        color: '#fff'
    },
    usernameview: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "start",
        alignItems: "center",
        gap: 20,
        padding: 10,
    },
    textuser: {
        fontSize: 20,
        fontWeight: 600,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },


});
export default index
