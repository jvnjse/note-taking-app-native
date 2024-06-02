import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, StatusBar, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import proimage from '../../assets/images/11.png'
import { config } from '../../utils/config';
import axios from 'axios'
import noteico from '../../assets/images/note add.png'
import AddNote from '../../components/AddNote';
import { GestureHandlerRootView, PanGestureHandler, Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorContext } from '../../utils/ColorContext';

const NoteScreen = () => {
    const [data, setdata] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [note, setnote] = useState()
    const swipeableRef = useRef(null);
    const { selectedColor } = useContext(ColorContext);

    const [styles, setStyles] = useState(createStyles(selectedColor));

    useEffect(() => {
        setStyles(createStyles(selectedColor));
    }, [selectedColor]);

    const onAddSticker = (notes) => {
        setIsModalVisible(true);
        console.log(notes)
        if (notes) {
            setnote(notes)
            console.log("if")
        } else {
            setnote('')
            console.log("else")

        }
    };

    const onModalClose = () => {
        setIsModalVisible(false);
        setnote('')
    };




    async function GetNotes() {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        axios.get(`${config.baseurl}/notes`, { headers: headers })
            .then((res) => {
                setdata(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }


    useEffect(() => {
        GetNotes()
    }, [])


    return (
        <>
            <View style={styles.container} >
                <LinearGradient colors={[selectedColor, selectedColor]}>
                    <View style={styles.titlecontainer}>
                        <View>
                            <Text style={styles.Pagetitle}>My Notes</Text>
                        </View>
                        <View>

                            <Link href='/profile' style={{ width: 60, height: 60 }}>
                                <View >
                                    <Image source={proimage} style={styles.profileimageico}></Image>
                                </View>
                            </Link>
                        </View>

                    </View>
                </LinearGradient>
                <ScrollView>
                    <GestureHandlerRootView style={styles.container}>
                        <View style={styles.notesContainer}>
                            {data && data.map((note, index) => (
                                <SwipeableNote key={index} note={note} onAddSticker={onAddSticker} GetNotes={GetNotes} swipeableRef={swipeableRef} selectedColor={selectedColor} />
                            ))}
                        </View>
                    </GestureHandlerRootView>
                </ScrollView>
                <Pressable onPress={() => onAddSticker()}>
                    <View style={styles.addicon} >
                        <Image style={styles.icon} source={noteico}></Image>
                    </View>
                </Pressable>
            </View>
            {isModalVisible &&

                <AddNote isVisible={isModalVisible} onClose={onModalClose} GetNotes={GetNotes} note={note} swipeableRef={swipeableRef} selectedColor={selectedColor}></AddNote>
            }
        </>
    );
};



const createStyles = (selectedColor) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    titlecontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
        // paddingTop: StatusBar.currentHeight + 25,
    },
    Pagetitle: {
        fontSize: 25,
        fontWeight: 'bold',
        padding: 10,
        color: '#fff'
    },
    notesContainer: {
        padding: 10,
        overflow: 'clip'
    },
    note: {
        borderRadius: 8,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },

    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    noteContent: {
        fontSize: 14,
        marginTop: 5,
    },
    profileimageico: {
        width: 50,
        height: 50,
    },
    addicon: {
        width: 60,
        height: 60,
        backgroundColor: selectedColor,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center"
    },
    icon: {
        width: 30,
        height: 30,
        filter: "invert(60%)",

    },
    action: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        backgroundColor: selectedColor,
        marginVertical: 10
    },
    actionText: {
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default NoteScreen;


const SwipeableNote = ({ note, onAddSticker, GetNotes, swipeableRef, selectedColor }) => {

    const headers = {

        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    function DeleteNote(id) {
        axios.delete(`${config.baseurl}/notes/${id}`, { headers: headers })
            .then((res) => {
                GetNotes()
                if (swipeableRef.current) {
                    swipeableRef.current.close();
                }
            }).catch((err) => {
                console.log(err)
            })
    }
    const [styles, setStyles] = useState(createStyles(selectedColor));

    useEffect(() => {
        setStyles(createStyles(selectedColor));
    }, [selectedColor]);
    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={() => (
                <Pressable style={styles.action} onPress={() => onAddSticker(note)}>
                    <View >
                        <Feather name="edit" size={24} color="white" />
                    </View>
                </Pressable>
            )}
            renderRightActions={() => (
                <Pressable style={styles.action} onPress={() => DeleteNote(note.id)}>
                    <View >
                        <MaterialIcons name="delete" size={24} color="white" />
                    </View>
                </Pressable>
            )}
        >
            <PanGestureHandler>
                <Animated.View style={styles.note}>
                    <LinearGradient colors={['#ffffff', '#fff']} style={styles.noteGradient}>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteContent}>{note.content}</Text>
                    </LinearGradient>
                </Animated.View>
            </PanGestureHandler>
        </Swipeable>
    );
};



