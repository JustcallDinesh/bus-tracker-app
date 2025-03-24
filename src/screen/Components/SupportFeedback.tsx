import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SupportFeedbackProps {
    phoneNumber?: string;
    email?: string;
    feedbackFormUrl?: string;
}

const SupportFeedback: React.FC<SupportFeedbackProps> = ({ phoneNumber, email, feedbackFormUrl }) => {
    const handleCall = () => {
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };

    const handleEmail = () => {
        if (email) {
            Linking.openURL(`mailto:${email}`);
        }
    };

    const handleFeedback = () => {
        if (feedbackFormUrl) {
            Linking.openURL(feedbackFormUrl);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Support & Feedback</Text>

            {phoneNumber && (
                <View style={styles.option} >
                    <Icon name="call" size={24} color="teal" style={styles.optionIcon} />
                    <Text style={styles.optionText} onPress={handleCall}>Call Support</Text>
                </View>
            )}

            {email && (
                <View style={styles.option} >
                    <Icon name="mail" size={24} color="teal" style={styles.optionIcon} />
                    <Text style={styles.optionText} onPress={handleEmail}>Email Us</Text>
                </View>
            )}

            {feedbackFormUrl && (
                <View style={styles.option} >
                    <Icon name="document-text" size={24} color="teal" style={styles.optionIcon} />
                    <Text style={styles.optionText} onPress={handleFeedback}>Feedback Form</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionIcon: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        color: 'teal',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
});

export default SupportFeedback;
