import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomHeaderProps {
    navigation: any;
    from: string;
    to: string;
    date: string;
    setShowSearchInput: React.Dispatch<React.SetStateAction<boolean>>; // Add this prop
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation, from, to, date, setShowSearchInput }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <View style={styles.betweenContainer}>
                    <Text style={styles.fromTo}>
                        {from} to {to}
                    </Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
                <TouchableOpacity style={styles.pwt} onPress={() => setShowSearchInput((PrevShowSearchInput) => !PrevShowSearchInput)}>
                    <Icon name="create-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <Icon name="cash" size={25} color="#FFB433" />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 5,
        paddingVertical: 12,
        borderRadius: 20,
        opacity: .8,
        position: 'static',
        borderBottomWidth: 0.5,
        borderColor: '#ccc'
    },
    textContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 15,
        backgroundColor: '#EAEAEA',//lightGrey
        paddingVertical: 2,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    betweenContainer: {
        flexDirection: 'column',
    },
    fromTo: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 15,
        textTransform: 'capitalize',
        width: 150,
    },
    date: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000',
        minWidth: 60,

    },
    pwt: {

    },
    money: {
        backgroundColor: '#EAEAEA',
        padding: 5,
        borderRadius: 20,
    }
});

export default CustomHeader;

