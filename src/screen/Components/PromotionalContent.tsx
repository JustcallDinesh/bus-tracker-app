import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface PromotionItem {
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    onPress: () => void;
}

interface PromotionalContentProps {
    promotions: PromotionItem[];
}

const PromotionalContent: React.FC<PromotionalContentProps> = ({ promotions }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Special Offers & Updates</Text>
            {promotions.map((promotion, index) => (
                <View key={index} style={styles.promotionCard} >
                    <Image source={{ uri: promotion.imageUrl }} style={styles.promotionImage} />
                    <View style={styles.promotionText} >
                        <Text style={styles.promotionTitle}>{promotion.title}</Text>
                        <Text style={styles.promotionDescription}>{promotion.description}</Text>
                    </View>
                    <TouchableOpacity style={styles.promotionButton} onPress={promotion.onPress}>
                        <Text style={styles.promotionButtonText}>{promotion.buttonText}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    promotionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    promotionImage: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.13)'
    },
    promotionText: {
        flex: 1,
        padding: 10,
    },
    promotionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    promotionDescription: {
        fontSize: 14,
        color: '#333',
    },
    promotionButton: {
        backgroundColor: '#007bff',
        padding: 10,
    },
    promotionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PromotionalContent;
