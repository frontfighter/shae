import React, { Component } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import * as shaefitApi from "../../../API/shaefitAPI";

/*
* DaySchedule screen design
*/

const { width, height } = Constants.ScreenSize;

class DaySchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            days: [],
            dayPlan: undefined,
            links: undefined,
            loadMoreLoading: false
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            const response = await shaefitApi.getDayPlan(1, `999${this.props.biotypeStatus}`);
            this.setState({ loading: false, links: response.links })
            if (response && response.data && response.data.length > 0) {
                let temp = []
                response.data.map((item) => {
                    item.attributes && item.attributes.map((item) => temp.push(item))
                });
                let dayPlanObj = temp[0];
                let tempDay = [];
                tempDay.push(dayPlanObj.day_1, dayPlanObj.day_2, dayPlanObj.day_3, dayPlanObj.day_4, dayPlanObj.day_5, dayPlanObj.day_6,
                    dayPlanObj.day_7, dayPlanObj.day_8, dayPlanObj.day_9, dayPlanObj.day_10);
                this.setState({ dayPlan: dayPlanObj, days: tempDay });
            }
        } catch (e) {
            this.setState({ loading: false })
        }
    }

    renderDays = (item, index) => {
        return (
            <View key={index} style={[styles.dayRenderView, {
                backgroundColor: item == 'D' ? Colors.AppleGreen : Colors.Coral,
                width: Math.floor((width - 55) / 2), marginRight: index % 2 == 0 ? 15 : 0
            }]}>
                <Text style={styles.dayTitleTxt}>DAY {index + 1}</Text>
                <View style={styles.dayNameView}>
                    <Text style={styles.dayNameTxt}>{item == 'D' ? 'Detox' : 'Optimize'}</Text>
                </View>
            </View>
        )
    }

    listEmptyComponent = () => {
        return (
            <Text>No day list found</Text>
        )
    }

    render() {
        const { onContinue } = this.props;
        const { dayPlan, days, loading } = this.state;
        return (
            <View style={styles.container}>
                {
                    loading ?
                        <View style={styles.loadingStyle}>
                            <ActivityIndicator size="large" color="#00a8eb" />
                        </View>
                        :
                        <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                            <Text style={styles.dayScheduleTxt}>Your 10 Day Schedule</Text>
                            <View style={styles.detoxDayView}>
                                <View style={styles.subSectionView}>
                                    <Image source={Icons.LeafsIcon} style={styles.imageView} />
                                    <Text style={styles.normalTitleTxt}>{dayPlan && dayPlan.detox_title}</Text>
                                </View>
                                <Text style={styles.normalTxt}>{dayPlan && dayPlan.detox_text}</Text>
                            </View>
                            <View style={styles.optimizeDayView}>
                                <View style={styles.subSectionView}>
                                    <Image source={Icons.OptimizeIcon} style={styles.imageView} />
                                    <Text style={styles.normalTitleTxt}>{dayPlan && dayPlan.optimise_title}</Text>
                                </View>
                                <Text style={styles.normalTxt}>{dayPlan && dayPlan.optimise_text}</Text>
                            </View>
                            <FlatList
                                scrollEnabled={false}
                                data={days}
                                extraData={this.state}
                                style={{ marginBottom: 17 }}
                                numColumns={2}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderDays(item, index)}
                                ListEmptyComponent={() => this.listEmptyComponent()}
                            />
                        </ScrollView>
                }
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default DaySchedule;