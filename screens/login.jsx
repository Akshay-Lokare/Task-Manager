import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity,
    TextInput
} from 'react-native';

export default function Login() {
    
    const [name, setName] = useState('');
    const navigation = useNavigation(); 

    return (
        <View style={styles.container}> 

            <TextInput 
                placeholder='Enter your name...'
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TouchableOpacity
            onPress={() => {
                navigation.navigate("MainTabs", { screen: "Home", params: { name: name } });
            }}
            style={styles.button}
            >
            <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: '#e0f7fa', // Soft cyan background
        padding: 20,
    },
    input: {
        height: 50,
        width: '80%',
        borderColor: '#26c6da', // Bubbly cyan border color
        borderWidth: 2,
        borderRadius: 30,
        paddingLeft: 20,
        fontSize: 18,
        marginBottom: 20,
        backgroundColor: '#ffffff', // White input background
    },
    button: {
        backgroundColor: '#00bcd4', // Cyan button background
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
