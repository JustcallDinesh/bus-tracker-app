import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecentSearchesProps {
    showAllRecentSearches: boolean;
    setShowAllRecentSearches: (show: boolean) => void;
    onSearch: (from: string, to: string) => void;
    addNewSearch: (newSearch: { from: string; to: string }) => void;
}
export interface RecentSearchesRef {
    updateRecentSearches: (newSearch: { from: string; to: string }) => void;
}

const RecentSearches = forwardRef<RecentSearchesRef, RecentSearchesProps>(
    ({ showAllRecentSearches, setShowAllRecentSearches, onSearch, addNewSearch }, ref) => {
        const [recentSearches, setRecentSearches] = useState<{ from: string; to: string }[]>([]);

        useEffect(() => {
            const loadRecentSearches = async () => {
                try {
                    const storedSearches = await AsyncStorage.getItem('recentSearches');
                    if (storedSearches) {
                        setRecentSearches(JSON.parse(storedSearches));
                    } else {
                        console.log('No recent searches here');
                    }
                } catch (error) {
                    console.error('Error loading recent searches:', error);
                }
            };

            loadRecentSearches();
        }, []);

        const saveRecentSearches = async (searches: { from: string; to: string }[]) => {
            try {
                await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
            } catch (error) {
                console.error('Error saving recent searches:', error);
            }
        };

        const updateRecentSearches = (newSearch: { from: string; to: string }) => {
            const updatedSearches = [
                newSearch,
                ...recentSearches.filter(
                    (search) => search.from !== newSearch.from || search.to !== newSearch.to
                ),
            ].slice(0, 3);
            setRecentSearches(updatedSearches);
            saveRecentSearches(updatedSearches);
        };

        useImperativeHandle(ref, () => ({
            updateRecentSearches,
        }));
        return (
            <View style={styles.recentSearchesContainer}>
                <View style={styles.recent}>
                    <Text style={styles.recentSearchesTitle}>Recently Searched</Text>
                    {recentSearches.length > 1 && (
                        <TouchableOpacity
                            style={styles.recentSearchesTitle}
                            onPress={() => setShowAllRecentSearches(!showAllRecentSearches)}
                        >
                            <Text style={styles.viewMoreButtonText}>
                                {showAllRecentSearches ? 'View Less' : 'View More'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                {recentSearches
                    .slice(0, showAllRecentSearches ? recentSearches.length : 1)
                    .map((search, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.recentSearchItem}
                            onPress={() => onSearch(search.from, search.to)}
                        >
                            <Text style={styles.recentSearchText}>{search.from} - {search.to}</Text>
                        </TouchableOpacity>
                    ))}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    recentSearchesContainer: {
        padding: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
        elevation: 2
    },
    recentSearchesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    recentSearchItem: {
        padding: 9,
        borderRadius: 6,
        marginBottom: 8,
        backgroundColor: 'rgba(220, 218, 215, 0.36)',
    },
    recentSearchText: {
        fontSize: 16,
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontStyle: 'italic',
        letterSpacing: .5,
    },
    viewMoreButtonText: {
        color: 'teal',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    recent: {
        flexDirection: "row",
        paddingRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});

export default RecentSearches;







