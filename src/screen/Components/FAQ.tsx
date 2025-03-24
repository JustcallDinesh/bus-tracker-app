import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    faqData: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqData }) => {
    const [expandedItems, setExpandedItems] = useState<number[]>([]);
    const [showAll, setShowAll] = useState(false);

    const toggleItem = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (expandedItems.includes(index)) {
            setExpandedItems(expandedItems.filter((itemIndex) => itemIndex !== index));
        } else {
            setExpandedItems([...expandedItems, index]);
        }
    };

    const toggleShowAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowAll(!showAll);
        if (!showAll) {
            setExpandedItems(faqData.map((_, index) => index));
        } else {
            setExpandedItems([]);
        }
    };

    const displayedData = showAll ? faqData : faqData.slice(0, 2);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>FAQ</Text>
                <TouchableOpacity style={styles.viewMoreButton} onPress={toggleShowAll}>
                    <Text style={styles.viewMoreText}>{showAll ? 'View Less ' : 'View More '}</Text>
                </TouchableOpacity>
            </View>

            {displayedData.map((item, index) => (
                <View key={index} style={styles.item}>
                    <TouchableOpacity style={styles.questionContainer} onPress={() => toggleItem(index)}>
                        <Text style={styles.question}>{item.question}</Text>
                        <Icon
                            name={expandedItems.includes(index) ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#000"
                        />
                    </TouchableOpacity>
                    {expandedItems.includes(index) && (
                        <View style={styles.answerContainer}>
                            <Text style={styles.answer}>{item.answer}</Text>
                        </View>
                    )}
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
        elevation: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    viewMoreButton: {
        padding: 8,
    },
    viewMoreText: {
        color: 'teal',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    item: {
        marginBottom: 10,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    answerContainer: {
        paddingVertical: 5,
    },
    answer: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
});

export default FAQ;
