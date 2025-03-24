import React from 'react';
import { View, StyleSheet } from 'react-native';

const VerticalLine = ({ style }) => (
    <View style={[styles.line, style]} />
);

const styles = StyleSheet.create({
    line: {
        width: 2, // Adjust line thickness as needed
        backgroundColor: '#ccc', // Or any color you prefer
        alignSelf: 'center', // Center the line vertically
    },
});

export default VerticalLine;
