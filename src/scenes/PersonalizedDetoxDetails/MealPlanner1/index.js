import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import RequestedPage from "../../RequestedPage";
import { URL_ADRESS } from "../../../constants";
import PropTypes from "prop-types";

/*
* MealPlanner1 screen design
*/

class MealPlanner1 extends Component {

    static propTypes = {
        isOverlay: PropTypes.bool,
        uri: PropTypes.string,
        lat: PropTypes.number,
        lng: PropTypes.number,
        notificationData: PropTypes.object,
    };

    static defaultProps = {
        isOverlay: true,
        uri: `${URL_ADRESS}/mobile/mealplan`,
        lat: null,
        lng: null,
        notificationData: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            accordionData: [
                {
                    expanded: false, title: "Day 1", name: 'Detox', data: [
                        { name: 'Smoked Salmon and Herb Ch…', type: 'Breakfast', review: 'Excellent', Prep: '12m', Cook: '40m', img: Icons.Detox2Img },
                        { name: 'Crock Pot Roast with Vegeta…', type: 'Launch', review: 'Excellent', Prep: '30m', Cook: '60m', img: Icons.Detox2Img },
                        { name: 'Easy Baked Pesto Chicken', type: 'Dinner', review: 'Good', Prep: '45m', Cook: '120m', img: Icons.Detox2Img }
                    ]
                },
                {
                    expanded: false, title: "Day 2", name: 'Optimize', data: [
                        { name: 'Smoked Salmon and Herb Ch…', type: 'Breakfast', review: 'Good', Prep: '52m', Cook: '20m', img: Icons.Detox2Img },
                        { name: 'Crock Pot Roast with Vegeta…', type: 'Launch', review: 'Good', Prep: '40m', Cook: '70m', img: Icons.Detox2Img },
                        { name: 'Easy Baked Pesto Chicken', type: 'Dinner', review: 'Good', Prep: '25m', Cook: '10m', img: Icons.Detox2Img }
                    ]
                },
                { expanded: false, title: "Day 3", name: 'Optimize', data: [] },
                {
                    expanded: false, title: "Day 4", name: 'Optimize', data: [
                        { name: 'Smoked Salmon and Herb Ch…', type: 'Breakfast', review: 'Good', Prep: '125m', Cook: '45m', img: Icons.Detox2Img },
                        { name: 'Crock Pot Roast with Vegeta…', type: 'Launch', review: 'Excellent', Prep: '88m', Cook: '60m', img: Icons.Detox2Img },
                        { name: 'Easy Baked Pesto Chicken', type: 'Dinner', review: 'Excellent', Prep: '55m', Cook: '10m', img: Icons.Detox2Img }
                    ]
                },
                { expanded: false, title: "Day 5", name: 'Detox', data: [] },
                { expanded: false, title: "Day 6", name: 'Optimize', data: [] },
                { expanded: false, title: "Day 7", name: 'Optimize', data: [] },
                { expanded: false, title: "Day 8", name: 'Optimize', data: [] },
                { expanded: false, title: "Day 9", name: 'Optimize', data: [] },
                { expanded: false, title: "Day 10", name: 'Detox', data: [] },
            ]
        }
    }

    dinnerType = (nameType) => {
        switch (nameType) {
            case 'Breakfast':
                return Colors.TickleMePink;
            case 'Launch':
                return Colors.DarkOrange;
            case 'Dinner':
                return Colors.Primary;
            default:
                return Colors.Black
        }
    }

    onAccordionOpen = (item, index) => {
        const array = this.state.accordionData.map((item) => {
            const newItem = Object.assign({}, item);
            newItem.expanded = false;
            return newItem;
        });

        array[index].expanded = !item.expanded;

        this.setState(() => {
            return {
                accordionData: array
            }
        });
    }

    renderSnack = (item, index, totalLength) => {
        return (
            <View key={index} style={CommonStyles.flexRow}>
                <Image source={item.img} style={styles.mealSubRenderImg} resizeMode='contain' />
                <View>
                    <Text style={[styles.dinnerTypeTxt, { color: this.dinnerType(item.type) }]}>{item.type}</Text>
                    <Text ellipsizeMode='tail' style={styles.mealTitleTxt}>{item.name}</Text>
                    <View style={styles.cookView}>
                        <View style={styles.timerIcon}></View>
                        <Text style={styles.cookTitle}>Prep: {item.Prep} / Cook: {item.Cook}</Text>
                    </View>
                    <View style={styles.reviewView}>
                        <View style={styles.startIcon}></View>
                        <Text style={styles.reviewTxt}>{item.review}</Text>
                    </View>
                    {totalLength && totalLength > 0 && ((totalLength - 1) == index) ? <View style={styles.marginBottom20} /> :
                        <View style={[styles.separatorLineStyle, { marginTop: 13, marginBottom: 13 }]} />}
                </View>
            </View>
        )
    }

    renderMealPlanner = (itemData, i) => {
        return (
            <View key={i}>
                <TouchableOpacity activeOpacity={0.7}
                    style={styles.accordionView}
                    onPress={() => this.onAccordionOpen(itemData, i)}>
                    <Text
                        style={styles.accordionTitle}>{itemData.title}</Text>
                    <View style={[styles.selectDayType, {
                        backgroundColor: (itemData.name == 'Detox') ? Colors.AppleGreen : Colors.Coral,
                    }]}>
                        <Text style={styles.dayTypeTxt}>{itemData.name}</Text>
                    </View>
                    <View style={styles.accordionEndView}>
                        <View style={CommonStyles.flexOne} />
                        {
                            itemData.expanded && <View style={styles.sanckView}>
                                <Text style={styles.addSnackTxt}>Add Snacks</Text>
                            </View>
                        }
                        <Image source={itemData.expanded ? Icons.ArrowUpIcon : Icons.ArrowDownIcon} resizeMode='contain' style={styles.upDownIcon} />
                    </View>
                </TouchableOpacity>
                {
                    itemData.expanded &&
                    <FlatList
                        data={itemData.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderSnack(item, index, itemData.data.length)}
                    />
                }
            </View>
        )
    }

    onBridgeMessage = (strMsg) => {
        const msg = JSON.parse(strMsg);
        console.log('onBridgeMessage', msg)
        console.log("URL_ADRESS", msg.url);
    }

    render() {
        const { onContinue } = this.props;
        const { accordionData } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.scrollViewStyle}>
                    <Text style={styles.mealPlannerTxt}>Plan Your Detox</Text>
                    <Text style={styles.mealPlannerDesTxt}>We’ve planned your detox recipes below and you can still edit/change if you want to.</Text>
                </View>
                {/* <FlatList
                        data={accordionData}
                        style={styles.marginBottom20}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderMealPlanner(item, index)}
                        ItemSeparatorComponent={() => <View style={styles.separatorLineStyle} />}
                    /> */}
                <View style={{ flex: 1, marginBottom: 10 }}>
                    <RequestedPage
                        onBridgeMessage={this.onBridgeMessage}
                        uri={this.props.uri}
                        lat={this.props.lat}
                        lng={this.props.lng}
                        notificationData={this.props.notificationData}
                    />
                </View>
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default MealPlanner1;