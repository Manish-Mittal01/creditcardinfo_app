import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { Card, Icon } from 'react-native-elements';

const MyCard = () => {
    return (
        <View>
            {/* <Card containerStyle={styles.card}>
                <Card.Image
                    source={{ uri: 'https://example.com/your-image-url.jpg' }}
                    style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Card Title</Text>
                    <Text style={styles.cardDescription}>
                        This is a beautiful card design created using React Native.
                    </Text>
                    <Icon
                        name="heart"
                        type="font-awesome"
                        color="#f50"
                        onPress={() => console.log('Liked')}
                    />
                </View>
            </Card> */}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        elevation: 3, // for Android shadow
    },
    cardImage: {
        height: 200,
    },
    cardContent: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDescription: {
        marginTop: 10,
    },
});

export default MyCard;
