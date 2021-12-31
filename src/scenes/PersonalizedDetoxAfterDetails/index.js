import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Icons } from '@common';
import styles from './style';
import Congratulations from './Congratulations';
import Results from './Results';
import NextSteps from './NextSteps';

/*
* PersonalizedDetoxAfterDetails screen design
*/

class PersonalizedDetoxAfterDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            selectTabName: 'Congratulations',
            tabarray: ['Congratulations', 'Results', 'Next Steps']
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
            <TouchableOpacity style={[styles.tabRenderView, { marginLeft: index == 0 ? 20 : 0 }]} onPress={() => this.onPressItem(item, index)}>
                <View style={[styles.tabSelectionView, { borderBottomWidth: activeIndex === index ? 2 : 0 }]}>
                    <Text style={[styles.tabName, { color: activeIndex === index ? Colors.Montana : Colors.LightGray }]}>{item}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderTabView = () => {
        const { selectTabName } = this.state;
        switch (selectTabName) {
            case 'Congratulations':
                return <Congratulations onContinue={() => this.onContinue('Results')} />
            case 'Results':
                return <Results onContinue={() => this.onContinue('Next Steps')} />
            case 'Next Steps':
                return <NextSteps />
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

export default PersonalizedDetoxAfterDetails;