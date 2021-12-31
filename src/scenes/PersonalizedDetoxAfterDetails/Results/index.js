import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ImageBackground, ScrollView } from 'react-native';
import { CommonStyles, Colors, Icons, Constants } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import LineChart from '../../../components/LineChart';
import BoxChart from '../../../components/BoxChart';

/*
* Results screen design
*/

class Results extends Component {

    constructor(props) {
        super(props);
        this.state = {
            foodList: [{ frgrp_21: 55, day: '1', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 60, day: '2', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 57, day: '3', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 62, day: '4', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 65, day: '5', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 70, day: '6', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 75, day: '7', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 77, day: '8', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 80, day: '9', frgrp21Color: Colors.PrimaryColorOpacity(0.7) },
            { frgrp_21: 85, day: '10', frgrp21Color: Colors.PrimaryColorOpacity(0.7) }],
            moodList: [{ frgrp_21: 40, day: '1', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 30, day: '2', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 45, day: '3', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 50, day: '4', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 55, day: '5', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 60, day: '6', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 63, day: '7', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 65, day: '8', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 70, day: '9', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) },
            { frgrp_21: 75, day: '10', frgrp21Color: Colors.BrilliantRoseOpacity(0.7) }],
            physicalActivityList: [{ frgrp_21: 55, day: '1', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 45, day: '2', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 58, day: '3', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 65, day: '4', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 70, day: '5', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 78, day: '6', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 80, day: '7', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 85, day: '8', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 88, day: '9', frgrp21Color: Colors.JadeOpacity(0.7) },
            { frgrp_21: 90, day: '10', frgrp21Color: Colors.JadeOpacity(0.7) }],
            sleepList: [{ frgrp_21: 30, day: '1', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 35, day: '2', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 40, day: '3', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 37, day: '4', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 45, day: '5', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 50, day: '6', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 55, day: '7', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 60, day: '8', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 65, day: '9', frgrp21Color: Colors.BrightSunOpacity(0.7) },
            { frgrp_21: 70, day: '10', frgrp21Color: Colors.BrightSunOpacity(0.7) }],
            overallFeelingList: [{ frgrp_21: 40, day: '1', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 42, day: '2', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 45, day: '3', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 38, day: '4', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 48, day: '5', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 55, day: '6', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 60, day: '7', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 65, day: '8', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 70, day: '9', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) },
            { frgrp_21: 75, day: '10', frgrp21Color: Colors.MediumSlateBlueOpacity(0.7) }]
        }
    }


    render() {
        const { foodList, moodList, physicalActivityList, sleepList, overallFeelingList } = this.state;
        const { onContinue } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                    <Text style={styles.titleTxt}>Wow! Look at your Results Rebecca!</Text>
                    <Text style={styles.questionTitle}>{`1. Your Before & After Journey!`}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <ImageBackground source={Icons.BeforeJourneyImg} style={styles.beforeAfterImg} >
                            <View style={styles.brforeView}>
                                <Text style={styles.beforeAfterTxt}>BEFORE</Text>
                            </View>
                        </ImageBackground>
                        <ImageBackground source={Icons.AfterJourneyImg} style={styles.beforeAfterImg}>
                            <View style={styles.afterView}>
                                <Text style={styles.beforeAfterTxt}>AFTER</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.separatorLineStyle} />
                    <Text style={styles.questionTitle}>2. How are you feeling, Rebecca?</Text>
                    <LineChart
                        dataList={foodList}
                        title="Food"
                        beforePercentage="58"
                        afterPercentage="85"
                        colorTxt={Colors.PrimaryColorOpacity(0.7)}
                        containerStyle={styles.marginBottom20}
                    />
                    <LineChart
                        dataList={moodList}
                        title="Mood"
                        beforePercentage="44"
                        afterPercentage="76"
                        colorTxt={Colors.BrilliantRoseOpacity(0.7)}
                        containerStyle={styles.marginBottom20}
                    />
                    <LineChart
                        dataList={physicalActivityList}
                        title="Physical Activity"
                        beforePercentage="60"
                        afterPercentage="96"
                        colorTxt={Colors.JadeOpacity(0.7)}
                        containerStyle={styles.marginBottom20}
                    />
                    <LineChart
                        dataList={sleepList}
                        title="Sleep"
                        beforePercentage="32"
                        afterPercentage="69"
                        colorTxt={Colors.BrightSunOpacity(0.7)}
                        containerStyle={styles.marginBottom20}
                    />
                    <LineChart
                        dataList={overallFeelingList}
                        title="Overall Feeling"
                        beforePercentage="40"
                        afterPercentage="75"
                        colorTxt={Colors.MediumSlateBlueOpacity(0.7)}
                    />
                    <View style={styles.separatorLineStyle} />
                    <Text style={styles.questionTitle}>3. How did you measure up, Rebecca?</Text>
                    <BoxChart
                        title="Chest"
                        beforeValue="88.9 cm"
                        afterValue="87.2 cm"
                        colorBox={Colors.PrimaryColorOpacity(0.7)}
                        leftBoxHeight={130}
                        rightBoxHeight={115}
                        containerStyle={styles.marginBottom20}
                    />
                    <BoxChart
                        title="BMI"
                        beforeValue="24.15"
                        afterValue="23.9"
                        colorBox={Colors.JadeOpacity(0.7)}
                        leftBoxHeight={130}
                        rightBoxHeight={120}
                        containerStyle={styles.marginBottom20}
                    />
                    <BoxChart
                        title="Lean Body Weight"
                        beforeValue="24.15"
                        afterValue="23.9"
                        colorBox={Colors.BrilliantRoseOpacity(0.7)}
                        leftBoxHeight={130}
                        rightBoxHeight={110}
                        containerStyle={styles.marginBottom20}
                    />
                    <BoxChart
                        title="Healthy Habits Index "
                        beforeValue="54%"
                        afterValue="81%"
                        colorBox={Colors.BrightSunOpacity(0.7)}
                        leftBoxHeight={70}
                        rightBoxHeight={125}
                    />
                    <View style={styles.separatorLineStyle} />
                    <Text style={styles.questionTitle}>Want to share your results? Let's show them together, Rebecca!</Text>
                    <TouchableOpacity
                        style={[styles.btnCommonStyle, styles.facebookBtnStyle]}>
                        <Image source={Icons.FacebookIcon} style={[styles.imgCommonStyle, styles.facebookIcon]} />
                        <Text style={[styles.TxtCommonStyle, styles.facebookTxt]}>Share on Facebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnCommonStyle, styles.twitterBtnStyle]}>
                        <Image source={Icons.TwitterIcon} style={[styles.imgCommonStyle, styles.twitterIcon]} />
                        <Text style={[styles.TxtCommonStyle, styles.twitterTxt]}>Share on Twitter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnCommonStyle, styles.instagramBtnStyle]}>
                        <Image source={Icons.InstagramIcon} style={[styles.imgCommonStyle, styles.instagramIcon]} />
                        <Text style={[styles.TxtCommonStyle, styles.instagramTxt]}>Share on Instagram</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorLineStyle} />
                </ScrollView>
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default Results;