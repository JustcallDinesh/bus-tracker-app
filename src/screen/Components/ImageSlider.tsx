import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';

interface ImageSliderProps {
    images: number[]; // Array of image paths (require statements)
    imageHeight?: number; // Optional height for images
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, imageHeight = 200 }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const imageWidth = Dimensions.get('screen').width * 0.8;

    useEffect(() => {
        let scrollInterval: NodeJS.Timeout;

        const startAutoScroll = () => {
            let currentIndex = 0;
            scrollInterval = setInterval(() => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ x: currentIndex * imageWidth, animated: true });
                    currentIndex = (currentIndex + 1) % images.length;
                }
            }, 5000);
        };

        startAutoScroll();

        return () => {
            clearInterval(scrollInterval);
        };
    }, [images.length]);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={image}
                        style={[styles.BusImage, { width: imageWidth, height: imageHeight }]}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        right: 50,
        // position: 'absolute',
        marginTop: 10,
        width: 500,
        height: 120, // Default height, can be overridden by props
        marginBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        // borderRadius: 15,
        flexDirection: 'row',
        // bottom: 180,
    },
    BusImage: {
        borderRadius: 5,
        elevation: 5,
        marginRight: 20,
        // marginLeft: 10,
        top: 10,
        left: 23,

    }
});

export default ImageSlider;