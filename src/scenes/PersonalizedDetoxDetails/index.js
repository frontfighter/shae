import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Icons } from '@common';
import styles from './style';
import Detox from './Detox';
import DaySchedule from './DaySchedule';
import DailyRoutines from './DailyRoutines';
import Preparation from './Preparation';
import PreDetoxChecklist from './PreDetoxChecklist';
import TopTips from './TopTips';
import StartDateDetox from './StartDateDetox';
import MealPlanner from './MealPlanner';
import Confirmation from './Confirmation';

/*
* PersonalizedDetoxDetails screen design
*/

class PersonalizedDetoxDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            selectTabName: 'Detox',
            tabarray: [
                'Detox', '10 Day Schedule', 'Daily Routines', 'Preparation', 'Pre-Detox Checklist', 'Top Tips', 'Start Date', 'Meal Planner', 'Confirmation',
            ]
        }
    }

    onPressItem = (item, index) => {
        this.setState({ activeIndex: index, selectTabName: item });
    }

    onContinue = (tabName) => {
        this.setState({ activeIndex: this.state.activeIndex + 1, selectTabName: tabName });
    }

    renderTopBar = (item, index) => {
        const { activeIndex } = this.state;
        return (
            <TouchableOpacity key={index} style={[styles.tabRenderView, { marginLeft: index == 0 ? 20 : 0 }]} onPress={() => this.onPressItem(item, index)}>
                <View style={[styles.tabSelectionView, { borderBottomWidth: activeIndex === index ? 2 : 0 }]}>
                    <Image source={Icons.TickCheckIcon} style={[styles.tabIcon, { tintColor: activeIndex > index ? Colors.AppleGreen : activeIndex === index ? Colors.Primary : Colors.PattensBlue }]} />
                    <Text style={[styles.tabName, { color: activeIndex === index ? Colors.Montana : Colors.LightGray }]}>{item}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderTabView = () => {
        const { selectTabName } = this.state;
        switch (selectTabName) {
            case 'Detox':
                return <Detox biotypeStatus={this.props.biotypeStatus} onContinue={() => this.onContinue('10 Day Schedule')} />
            case '10 Day Schedule':
                return <DaySchedule biotypeStatus={this.props.biotypeStatus} onContinue={() => this.onContinue('Daily Routines')} />
            case 'Daily Routines':
                return <DailyRoutines biotypeStatus={this.props.biotypeStatus} onContinue={() => this.onContinue('Preparation')} />
            case 'Preparation':
                return <Preparation onContinue={() => this.onContinue('Pre-Detox Checklist')} />
            case 'Pre-Detox Checklist':
                return <PreDetoxChecklist biotypeStatus={this.props.biotypeStatus} onContinue={() => this.onContinue('Top Tips')} />
            case 'Top Tips':
                return <TopTips biotypeStatus={this.props.biotypeStatus} onContinue={() => this.onContinue('Start Date')} />
            case 'Start Date':
                return <StartDateDetox onContinue={() => this.onContinue('Meal Planner')} />
            case 'Meal Planner':
                return <MealPlanner onContinue={() => this.onContinue('Confirmation')} />
            case 'Confirmation':
                return <Confirmation />
            default:
                return <View />
        }
    }

    render() {
        const { tabarray } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={tabarray}
                        extraData={this.state}
                        renderItem={({ item, index }) => this.renderTopBar(item, index)}
                    />
                </View>
                <View style={CommonStyles.flexOne}>
                    {this.renderTabView()}
                </View>
            </View>
        )
    }
}

export default PersonalizedDetoxDetails;