
import React from 'react';
import { StyleSheet, Text, Image, View } from 'react-native'
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NoRouteFounds = () => {
    return (
        <View style={styles.Container}>
            <Image source={require('./asset/MovingBus2.png')} style={styles.Bus} />
            <Text style={styles.text2}>No Route Founds for Your Searches... </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'aliceblue'
    },
    text: {
        fontSize: 30,
        color: '#888',
        fontStyle: 'italic',
        fontWeight: 600,
        bottom: 20
    },
    text2: {
        fontSize: 20,
        color: '#888',
        fontStyle: 'italic',
        fontWeight: 600
    },
    Bus: {
        height: 200,
        width: 300,
        objectFit: 'cover',
        marginBottom: 10
    }
})
export default NoRouteFounds;