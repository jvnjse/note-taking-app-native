import { Modal, View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { config } from '../utils/config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddNote({ isVisible, onClose, GetNotes, note, swipeableRef, selectedColor }) {
    const [title, settitle] = useState(note.title || '')
    const [content, setcontent] = useState(note.content || '')
    const [styles, setStyles] = useState(createStyles(selectedColor));

    useEffect(() => {
        setStyles(createStyles(selectedColor));
    }, [selectedColor]);


    const SubmitNote = async () => {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        const data = {
            title, content
        };
        try {
            const res = await axios.post(`${config.baseurl}/notes`, data, { headers: headers });
            GetNotes()
            onClose()
        } catch (err) {
            console.log(err);
        }
    };

    const EditNote = async (id) => {
        const token = await AsyncStorage.getItem('token')
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        const data = {
            title, content
        };
        try {
            const res = await axios.put(`${config.baseurl}/notes/${id}`, data, { headers: headers });
            GetNotes()
            onClose()
            if (swipeableRef.current) {
                swipeableRef.current.close();
            }
        } catch (err) {
            console.log(err);
        }
    };




    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add a Note</Text>
                    <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                    </Pressable>
                </View>
                <View>
                    <View style={styles.inputView}>
                        <Text style={styles.label}> Note Title</Text>
                        <TextInput style={styles.input} value={title} onChangeText={text => settitle(text)}></TextInput>
                    </View>

                    <View style={styles.inputView}>
                        <Text style={styles.label}> Note Content</Text>
                        <TextInput style={styles.inputcontent} value={content} multiline={true} onChangeText={text => setcontent(text)}></TextInput>
                    </View>
                    {note ?
                        <Pressable style={styles.button} onPress={() => { EditNote(note.id) }}>
                            <Text style={styles.buttonText} >Edit Note</Text>
                        </Pressable> :
                        <Pressable style={styles.button} onPress={SubmitNote}>
                            <Text style={styles.buttonText} >Add Note</Text>
                        </Pressable>
                    }
                </View>

            </View>
        </Modal>
    );
}

const createStyles = (selectedColor) => StyleSheet.create({
    modalContent: {
        // height: '40%',
        width: '90%',
        backgroundColor: '#fff',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
        // left: '50%',
        transform: [{ translateX: 20 }],
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    titleContainer: {
        height: '16%',
        backgroundColor: selectedColor,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    title: {
        color: '#fff',
        fontSize: 16,
    },
    inputView: {
        gap: 7,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5,
    },
    label: {
        fontSize: 18,
        color: selectedColor
    },
    input: {
        height: 50,
        paddingHorizontal: 10,
        borderColor: selectedColor,
        borderWidth: 1,
        borderRadius: 7
    },
    inputcontent: {
        height: 100,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: selectedColor,
        borderWidth: 1,
        borderRadius: 7
    },
    button: {
        width: '50%',
        backgroundColor: selectedColor,
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",

        margin: "auto",
        marginTop: 10,
        marginBottom: 30

    },
    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "semibold"
    },
});

