import React, { useState, useEffect, Component } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';

/*
* Congratulations screen design
*/

class Congratulations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            effortList: [
                { title: '1. Upload Your "After" Image Now', color: Colors.Primary, icon: Icons.ContactIcon, type: 'image', description: `Has your body changed during your Detox? A picture speaks a thousand words and it's a great way to see how you've changed!` },
                { title: '2. How are you feeling?', color: Colors.Cranberry, icon: Icons.FeelingIcon, type: '', description: `Take your final "How are you feeling?" quiz!` },
                { title: `3. Let's Update Your Measurements Now`, color: Colors.MediumSlateBlue, icon: Icons.measurement, type: '', description: `Update your measurements so you can see ALL your results! ` },
            ]
        }
    }

    renderEffort = (item, i) => {
        return (
            <View key={i}>
                <View style={CommonStyles.flexRow}>
                    <Image source={item.icon} style={styles.renderImg} />
                    <View style={CommonStyles.flexOne}>
                        <Text style={styles.titleTxt}>{item.title}</Text>
                        {
                            item.type == 'image' ? <View style={[CommonStyles.flexRow, { flexWrap: 'wrap' }]}>
                                <Text style={styles.descriptionTxt}>{item.description} </Text>
                                <View style={styles.tipsView}>
                                    <Text style={styles.tipsTxt}>Tip</Text>
                                </View>
                            </View>
                                : <Text style={styles.descriptionTxt}>{item.description}</Text>
                        }
                        {
                            item.type == 'image' &&
                            <View style={styles.uploadView}>
                                <Image source={Icons.CloudIcon} resizeMode="contain" style={styles.uploadImg} />
                                <Text style={styles.uploadTxt}>Upload Image</Text>
                            </View>
                        }
                    </View>
                    {item.type == '' && <Image source={Icons.ArrowGrayRightIcon} resizeMode='contain' style={styles.rightArrowStyle} />}
                </View>
                <View style={styles.separatorLineStyle} />
            </View>
        )
    }

    render() {
        const { effortList } = this.state;
        const { onContinue } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                    <Text style={styles.congratulationsTxt}>Congratulations! You’re done!</Text>
                    <Text style={styles.congratulationsDesTxt}>What a great gift you’ve given yourself <Text style={styles.nameTxt}>Rebecca!</Text> Now it’s time to appreciate all your effort!</Text>
                    <FlatList
                        data={effortList}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderEffort(item, index)}
                    />
                </ScrollView>
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default Congratulations;