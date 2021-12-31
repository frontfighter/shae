import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import { Actions } from 'react-native-router-flux';

/*
* Confirmation screen design
*/

class Confirmation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                    <Text style={styles.confirmationTxt}>You’re all set! </Text>
                    <Text style={styles.confirmationDesTxt}>{`You can come back to this preparation at any time before your Detox starts to use the checklists, update your meal planner and get thoroughly prepared.
                    \nA few days before your Detox we’ll touch base again to prepare your tracking so you can see your results at a glance.  During your Detox, you’ll receive daily notifications and you can come back to see your daily interactive routine right here.
                    \nDon’t forget to join your support community online for more helpful tips, ideas and inspiration here.`}</Text>
                    <CustomButton title="Explore the whole Detox again" containerStyle={{ borderRadius: 22, marginBottom: 15 }} onPress={() => Actions.PersonalizedDetoxAfterDetails()} />
                    <CustomButton title="Thanks, I’m Done!" containerStyle={{ borderRadius: 22 }} onPress={() => Actions.PersonalizedDetoxTrackProgress()}/>
                </ScrollView>
            </View>
        )
    }
}

export default Confirmation;