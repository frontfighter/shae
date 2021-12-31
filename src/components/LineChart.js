import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    Platform,
} from "react-native";
import Dialog, {
    FadeAnimation,
    SlideAnimation,
    DialogContent,
} from "react-native-popup-dialog";
import { Colors } from '@common';
const { height, width } = Dimensions.get("window");

const fadeAnimation = new FadeAnimation({
    toValue: 1,
    animationDuration: 200,
    useNativeDriver: true,
});

const shadowOpt = {
    width: width - 40,
    height: 48,
    color: "#273849",
    border: 18,
    radius: 10,
    opacity: 0.06,
    x: 0,
    y: 6,
    style: { marginTop: 0, alignSelf: "center" },
};

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allDayArray: [],
            isHintModalVisible: false,
            hintPositionX: 0,
            hintDate: "",
            hintValue: "",
            hintIndex: 0,
            hintItem: {},
            hintCountOfItems: 0,
        };

        this.totalDay = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    }

    getColoredSections = (item) => {
        if (item.countOfItems === 3) {
            return [
                {
                    height: (item.frgrp_avoid / 100) * 190 - 3 / 4,
                    backgroundColor: item.frgrpAvoidColor,
                    borderRadius: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    width: 16,
                },
                {
                    height: (item.frgrp_21 / 100) * 190 - 3 / 4,
                    backgroundColor: item.frgrp21Color,
                    borderRadius: 3,
                    marginTop: 2,
                    width: 16,
                },
                {
                    height: (item.frgrp_54 / 100) * 190 - 3 / 4,
                    backgroundColor: item.frgrp54Color,
                    borderRadius: 3,
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                    marginTop: 2,
                    width: 16,
                },
            ];
        } else if (item.countOfItems === 2) {
            let propName = item.hasOwnProperty("frgrp_avoid")
                ? item.frgrp_avoid
                : item.frgrp_21;
            let propName2 = item.hasOwnProperty("frgrp_54")
                ? item.frgrp_54
                : item.frgrp_21;
            return [
                {
                    height: (propName / 100) * 190 - 1,
                    backgroundColor: item.hasOwnProperty("frgrp_avoid")
                        ? item.frgrpAvoidColor
                        : item.frgrp21Color,
                    borderRadius: 2,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    width: 16,
                },
                {
                    height: (propName2 / 100) * 190 - 1,
                    backgroundColor: item.hasOwnProperty("frgrp_54")
                        ? item.frgrp54Color
                        : item.frgrp21Color,
                    borderRadius: 2,
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                    marginTop: 2,
                    width: 16,
                },
            ];
        } else if (item.countOfItems === 1) {
            let propName;
            let color;
            if (item.hasOwnProperty("frgrp_avoid")) {
                propName = item.frgrp_avoid;
                color = item.frgrpAvoidColor;
            } else if (item.hasOwnProperty("frgrp_21")) {
                propName = item.frgrp_21;
                color = item.frgrp21Color;
            } else {
                propName = item.frgrp_54;
                color = item.frgrp54Color;
            }

            return [
                {
                    height: (propName / 100) * 190,
                    backgroundColor: color,
                    borderRadius: 3,
                    width: 16,
                },
            ];
        } else return [];
    };


    componentDidMount() {
        const { dataList } = this.props;
        if (dataList.length > 0) {
            let array = [];
            for (let i = 0; i < dataList.length; i++) {
                let countOfItems = 0;
                let item = {};
                if (dataList[i].hasOwnProperty("frgrp_54")) {
                    countOfItems += 1;
                    item.frgrp_54 = dataList[i].frgrp_54;
                    item.frgrp54Color = dataList[i].frgrp54Color;
                }
                if (dataList[i].hasOwnProperty("frgrp_21")) {
                    countOfItems += 1;
                    item.frgrp_21 = dataList[i].frgrp_21;
                    item.frgrp21Color = dataList[i].frgrp21Color;
                }
                if (dataList[i].hasOwnProperty("frgrp_avoid")) {
                    countOfItems += 1;
                    item.frgrp_avoid = dataList[i].frgrp_avoid;
                    item.frgrpAvoidColor = dataList[i].frgrpAvoidColor;
                }
                item.countOfItems = countOfItems;
                item.day = dataList[i].day;
                array.push(item);
            }
            allDayArray = [];
            for (let i = 0; i < this.totalDay.length; i++) {
                let isItemFound = false;
                for (let k = 0; k < array.length; k++) {
                    if (array[k].day === this.totalDay[i]) {
                        isItemFound = true;
                        allDayArray.push({
                            ...array[k],
                            ...{ background: "rgb(255,255,255)" },
                        });
                        break;
                    }
                }

                if (!isItemFound) {
                    allDayArray.push({ background: "transparent", countOfItems: 0 });
                }
            }
            this.setState({ allDayArray });
        }
    }

    render() {
        let bars;
        if (this.state.allDayArray.length !== 0) {
            bars = this.state.allDayArray.map((item, index) => {
                const sectionsStyles = this.getColoredSections(item);
                const sections = sectionsStyles.map((item, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                width: 16,
                                backgroundColor: item.background,
                                borderRadius: 3,
                            }}
                        >
                            <View style={item} />
                        </View>
                    );
                });
                return (
                    <TouchableWithoutFeedback
                        key={index}
                    // onPress={() => this.onBarPress(index, item.value, item.day, item)}
                    >
                        <View
                            style={{
                                height: 190,
                                width: 16,
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    height: 190,
                                    width: 16,
                                    backgroundColor: item.background,
                                    justifyContent: 'flex-end',
                                    borderRadius: 3,
                                }}
                            >
                                {sections}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });
        }

        const { title, afterPercentage, beforePercentage, containerStyle, colorTxt } = this.props;
        return (
            <View style={[{ padding: 20, borderColor: Colors.LavenderGray, borderWidth: 1 }, containerStyle]}>
                <Text style={styles.titleStyle}>{title}</Text>
                <View style={styles.afterorBeforeView}>
                    <View>
                        <Text style={[styles.afterBeforeTitle, { color: colorTxt }]}>BEFORE</Text>
                        <Text style={styles.percentageTxt}>{beforePercentage}%</Text>
                    </View>
                    <View style={{ backgroundColor: Colors.LavenderGray, width: 1, marginLeft: 30, marginRight: 30 }} />
                    <View>
                        <Text style={[styles.afterBeforeTitle, { color: colorTxt }]}>AFTER</Text>
                        <Text style={styles.percentageTxt}>{afterPercentage}%</Text>
                    </View>
                </View>

                <View
                    style={{
                        height: 220,
                        width: width - 80,
                        alignSelf: "center",
                    }}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 27,
                            alignItems: "flex-end",
                        }}
                    >
                        <Text style={[styles.axisText, { marginTop: 0, width: 27 }]}>100%</Text>
                        <Text style={[styles.axisText, { marginTop: 33, width: 27 }]}>75%</Text>
                        <Text style={[styles.axisText, { marginTop: 33, width: 27 }]}>50%</Text>
                        <Text style={[styles.axisText, { marginTop: 33, width: 27 }]}>25%</Text>
                        <Text style={[styles.axisText, { marginTop: 30, width: 27 }]}>0%</Text>
                    </View>

                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 34,
                            width: width - 110,
                            // width: width - 85,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={styles.axisText}>1</Text>
                        <Text style={styles.axisText}>2</Text>
                        <Text style={styles.axisText}>3</Text>
                        <Text style={styles.axisText}>4</Text>
                        <Text style={styles.axisText}>5</Text>
                        <Text style={styles.axisText}>6</Text>
                        <Text style={styles.axisText}>7</Text>
                        <Text style={styles.axisText}>8</Text>
                        <Text style={styles.axisText}>9</Text>
                        <Text style={styles.axisText}>10</Text>
                    </View>

                    <View
                        style={{
                            position: "absolute",
                            top: 7.5,
                            width: width - 110,
                            left: 23,
                        }}
                    >
                        <View
                            style={{
                                width: width - 110,
                                height: 1,
                                backgroundColor: "rgb(238,240,244)",
                            }}
                        />
                        <View
                            style={{
                                width: width - 110,
                                height: 1,
                                backgroundColor: "rgb(238,240,244)",
                                marginTop: 47,
                            }}
                        />
                        <View
                            style={{
                                width: width - 110,
                                height: 1,
                                backgroundColor: "rgb(238,240,244)",
                                marginTop: 47,
                            }}
                        />
                        <View
                            style={{
                                width: width - 110,
                                height: 1,
                                backgroundColor: "rgb(238,240,244)",
                                marginTop: 47,
                            }}
                        />
                        <View
                            style={{
                                width: width - 110,
                                height: 1,
                                backgroundColor: "rgb(238,240,244)",
                                marginTop: 45,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            marginTop: 7.5,
                            width: width - 115,
                            height: 190,
                            marginLeft: 30,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        {bars}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        fontSize: 15,
        fontFamily: 'SFProText-Semibold',
        color: Colors.Black,
        marginBottom: 20
    },
    afterorBeforeView: {
        flexDirection: 'row',
        marginBottom: 25
    },
    afterBeforeTitle: {
        marginBottom: 4,
        fontSize: 11,
        fontFamily: 'SFProText-Bold',
        color: Colors.Primary
    },
    percentageTxt: {
        fontSize: 18,
        fontFamily: 'SFProText-Regular'
    },
    axisText: {
        color: "rgb(141,147,151)",
        fontFamily: "SFProText-Regular",
        fontWeight: "400",
        fontSize: 11,
        width: 20,
    },
    monthName: {
        color: "rgb(54,58,61)",
        fontFamily: "SFProText-Regular",
        fontWeight: "400",
        fontSize: 14,
    },
    dayText: {
        color: "rgb(54,58,61)",
        fontFamily: "SFProText-Regular",
        fontWeight: "400",
        fontSize: 17,
        letterSpacing: -0.3,
        marginTop: 4,
    },
    hintTitle: {
        color: "rgb(141,147,151)",
        fontFamily: "SFProText-Regular",
        fontWeight: "400",
        fontSize: 14,
    },
    hintPercentage: {
        color: "rgb(54,58,61)",
        fontFamily: "SFProText-Regular",
        fontWeight: "400",
        fontSize: 17,
        letterSpacing: -0.3,
    },
});

export default LineChart;
