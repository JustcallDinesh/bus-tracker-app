import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface UpdateItem {
    title: string;
    description: string;
    date: string;
}

interface CommunityUpdatesProps {
    updates: UpdateItem[];
}

const CommunityUpdates: React.FC<CommunityUpdatesProps> = ({ updates }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Community Updates & Announcements</Text>
            <ScrollView>
                {updates.map((update, index) => (
                    <View key={index} style={styles.updateItem}>
                        <Text style={styles.updateTitle}>{update.title}</Text>
                        <Text style={styles.updateDescription}>{update.description}</Text>
                        <Text style={styles.updateDate}>{update.date}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        // marginVertical: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    updateItem: {
        marginBottom: 16,
        padding: 10,
        borderRadius: 7,
        backgroundColor: 'aliceblue',
        elevation: 5,
        shadowColor: 'black',

    },
    updateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    updateDescription: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    updateDate: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
});

export default CommunityUpdates;
