import React, { useState, useEffect, Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import { Calendar } from "react-native-calendars";
import CalendarPicker from 'react-native-calendar-picker';
/*
* StartDateDetox screen design
*/

class StartDateDetox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
            selectedEndDate: null,
            startDateDetoxList: [
                { name: 'Look ahead in your calendar and choose a 10 day period when you are likely to have low-stress levels.', color: Colors.AppleGreen, icon: Icons.CalendarIcon },
                { name: 'Try to avoid scheduling your Detox when you have important social engagements (like parties and celebrations)', color: Colors.Ronchi, icon: Icons.PartyIcon },
                { name: 'Give yourself the time that you need to feel prepared and ready to go before you start.', color: Colors.Pink, icon: Icons.ClockTimeIcon },
            ],
        }
    }

    renderStartDateDetox = (item, index) => {
        const { startDateDetoxList } = this.state;
        return (
            <View key={index} style={[styles.renderDateView, { marginBottom: ((startDateDetoxList.length - 1) == index) ? 0 : 10 }]}>
                <Image source={item.icon} style={styles.renderImgStyle} />
                <Text style={styles.renderNameTxt}>{item.name}</Text>
            </View>
        )
    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }

    render() {
        const { onContinue } = this.props;
        const { startDateDetoxList} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                    <Text style={styles.startDateTxt}>Set Your Start Date</Text>
                    <Text style={styles.startDateDesTxt}>Choose the date that you will start your Detox</Text>
                    <FlatList
                        data={startDateDetoxList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderStartDateDetox(item, index)}
                    />
                    <Text style={styles.chooseDateTxt}>Choose Your Dates</Text>
                    <View style={styles.calendarView}>
                        <View style={styles.calendarHeaderView} />
                        <CalendarPicker
                            startFromMonday={true}
                            allowRangeSelection={true}
                            todayBackgroundColor="#fff"
                            weekdays={['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']}
                            nextComponent={<Image source={Icons.ArrowRightIcon} resizeMode="contain" style={styles.calendarRightIcon} />}
                            previousComponent={<Image source={Icons.ArrowLeftIcon} resizeMode="contain" style={styles.calendarLeftIcon} />}
                            selectedRangeStyle={styles.selectDateRangeView}
                            selectedRangeStartStyle={styles.selectStartDate}
                            selectedRangeEndStyle={styles.selectEndDate}
                            dayLabelsWrapper={styles.dayLabelView}
                            monthYearHeaderWrapperStyle={styles.monthLabelView}
                            textStyle={styles.calendarTextView}
                            onDateChange={(date, type) => this.onDateChange(date, type)}
                        />
                    </View>
                    {/* <Calendar
                        markingType={'period'}
                        markedDates={{
                            '2020-12-21': { startingDay: true, color: Colors.Primary, textColor: 'white' },
                            '2020-12-22': { color: Colors.PrimaryColorOpacity(0.20), textColor: 'white' },
                            '2020-12-23': { color: Colors.PrimaryColorOpacity(0.20), textColor: 'white' },
                            '2020-12-24': { endingDay: true, color: Colors.Primary, textColor: 'white' },
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: Colors.GrayOpacity(1),
                            borderRadius: 4
                        }}
                        theme={{
                            'stylesheet.calendar.header': {
                                header: {
                                    // override the default header style react-native-calendars/src/calendar/header/style.js
                                    backgroundColor: Colors.PrimaryColorOpacity(0.05), // set the backgroundColor for header
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                    marginLeft: -5,
                                    marginRight: -5
                                },
                                monthText: {
                                    color: Colors.Black,
                                    fontWeight: '700',
                                    fontSize: 16,
                                },
                                dayHeader: {
                                    marginTop: 2,
                                    marginBottom: 7,
                                    width: 30,
                                    textAlign: 'center',
                                    fontSize: 14,
                                    color: Colors.Black,
                                },
                                week: {
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: Colors.PrimaryColorOpacity(0.05),
                                    marginLeft: -5,
                                    marginRight: -5
                                }
                            }
                        }}
                    /> */}
                    <View style={styles.infoView}>
                        <Image source={Icons.InfoIcon} style={styles.infoIcon} />
                        <Text style={styles.infoDesTxt}><Text style={styles.noteTxt}>Please note:</Text> You can change the start date up until your Detox begins but once your detox has begun you cannot re-start or pause your Detox protocol.</Text>
                    </View>
                </ScrollView>
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default StartDateDetox;