import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
interface InfoCardProps {
    title: string;
    description: string;
    iconName: string;
    buttonText: string;
    onPress: () => void;
    backgroundColor: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    iconName,
    buttonText,
    onPress,
    backgroundColor,
}) => {
    return (
        <View style={[styles.card, { backgroundColor }]} >
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <Icons name={iconName} size={30} color="#fff" style={styles.icon} />
            </View>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{buttonText}</Text>
                <Icons name="arrow-right" size={16} color="#fff" style={styles.arrowIcon} />
            </TouchableOpacity>
        </View>
    );
};

interface HorizontalInfoCardsProps {
    cards: InfoCardProps[];
}

const HorizontalInfoCards: React.FC<HorizontalInfoCardsProps> = ({ cards }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.Header}>What's New </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cards.map((card, index) => (
                    <InfoCard key={index} {...card} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        // backgroundColor: 'red',
        height: 180,
        position: 'relative'
    },
    card: {
        width: 260,
        // height: 160,
        marginRight: 15,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    content: {
        elevation: 8,
        flex: 1,
        padding: 20,
    },
    Header: {
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 10,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 16,
    },
    icon: {
        alignSelf: 'flex-end',
        position: "absolute",
        top: 10,
        right: 20
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent overlay
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    arrowIcon: {
        marginLeft: 8,
    },
});

export default HorizontalInfoCards;

