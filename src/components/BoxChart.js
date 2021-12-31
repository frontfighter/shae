import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from "react-native";
import { Colors } from '@common';

const { height, width } = Dimensions.get("window");

class BoxChart extends Component {

    render() {
        const { title, beforeValue, afterValue, containerStyle, colorBox, leftBoxHeight, rightBoxHeight } = this.props;
        return (
            <View style={[{ padding: 20, borderColor: Colors.LavenderGray, borderWidth: 1 }, containerStyle]}>
                <Text style={styles.titleStyle}>{title}</Text>
                <View style={styles.afterorBeforeView}>
                    <View style={{width: Math.floor((width - 95) / 2), marginRight: 15}}>
                        <Text style={[styles.afterBeforeTitle, { color: colorBox }]}>BEFORE</Text>
                        <Text style={styles.percentageTxt}>{beforeValue}</Text>
                    </View>
                    <View style={{width: Math.floor((width - 95) / 2)}}>
                        <Text style={[styles.afterBeforeTitle, { color: colorBox }]}>AFTER</Text>
                        <Text style={styles.percentageTxt}>{afterValue}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', height: 130 }}>
                    <View style={{width: Math.floor((width - 95) / 2), height: leftBoxHeight, backgroundColor: colorBox, marginRight: 15, alignSelf: 'flex-end'}} />
                    <View style={{width: Math.floor((width - 95) / 2), height: rightBoxHeight, backgroundColor: colorBox , alignSelf: 'flex-end'}} />
                </View>
            </View>
        )
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
        marginBottom: 20
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
    }
});

export default BoxChart;