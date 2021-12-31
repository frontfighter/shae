import React, { useState, useEffect, Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import * as shaefitApi from "../../../API/shaefitAPI";

/*
* Detox screen design
*/

class Detox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detoxSummaryList: [],
            loading: false,
            links: undefined,
            loadMoreLoading: false
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            const response = await shaefitApi.getSummary(1, `999${this.props.biotypeStatus}`);
            this.setState({ loading: false, links: response.links })
            if (response && response.data && response.data.length > 0) {
                let temp = []
                response.data.map((item) => {
                    item.attributes && item.attributes.map((item) => temp.push(item))
                });
                this.setState({ detoxSummaryList: temp });
            }
        } catch (e) {
            this.setState({ loading: false })
        }
    }

    renderDetoxTypeIcon = (type) => {
        switch (type.trim()) {
            case 'Duration':
                return Icons.Calendar1Icon;
            case 'Detox':
                return Icons.LeafsIcon;
            case 'Essence':
                return Icons.EssenseIcon;
            case 'Tip':
                return Icons.TipsIcon;
        }
    }

    renderDetoxTypeTitle = (type) => {
        switch (type.trim()) {
            case 'Duration':
                return 'Duration of Detox';
            case 'Detox':
                return 'Type of Detox';
            case 'Essence':
                return 'Essence';
            case 'Tip':
                return 'Tips';
        }
    }

    renderDetoxSummary = (item, index) => {
        let title = item.type == 'Duration' && item.text.split(",");
        return (
            <View style={CommonStyles.flexRow}>
                <Image source={this.renderDetoxTypeIcon(item.type)} style={styles.imageView} resizeMode="contain" />
                {
                    item.type == 'Duration' ?
                        <View style={styles.subSectionView}>
                            <Text style={styles.normalTitleTxt}>{this.renderDetoxTypeTitle(item.type)}</Text>
                            <View style={styles.firstDetoxing}>
                                <View style={styles.greenOval} />
                                <Text style={[styles.normalTxt, CommonStyles.flexOne]}>{title[0].trim()}</Text>
                            </View>
                            <View style={styles.secondDetoxing}>
                                <View style={styles.orangeOval} />
                                <Text style={[styles.normalTxt, CommonStyles.flexOne]}>{title[1].trim()}</Text>
                            </View>
                        </View>
                        :
                        <View style={styles.subSectionView}>
                            <Text style={styles.normalTitleTxt}>{this.renderDetoxTypeTitle(item.type)}</Text>
                            <Text style={[styles.normalTxt, { marginTop: 5 }]}>{item.text}</Text>
                        </View>
                }
            </View>
        )
    }

    renderSeparator = () => {
        return (<View style={styles.separatorLineStyle} />)
    };

    listEmptyComponent = () => {
        return (
            <Text>No detox summary found</Text>
        )
    }

    loadMoreData = async () => {
        try {
            const { links } = this.state;
            if ((links != null && links != undefined) && (links != null && links.next != null)) {
                let str = links.next.split("page=")[1]
                let currentPage = str.split("&")[0];
                this.setState({ loadMoreLoading: true })
                const response = await shaefitApi.getSummary(currentPage, `999${this.props.biotypeStatus}`);
                this.setState({ loadMoreLoading: false, links: response.links })
                if (response && response.data && response.data.length > 0) {
                    let temp = []
                    response.data.map((item) => {
                        item.attributes && item.attributes.map((item) => temp.push(item))
                    });
                    this.setState({ detoxSummaryList: [...this.state.detoxSummaryList, ...temp] });
                }
            }
        } catch (e) {
            this.setState({ loadMoreLoading: false })
        }
    }

    renderFooter = () => {
        const { links, loadMoreLoading } = this.state;
        if (loadMoreLoading) {
            return (
                <View style={styles.moreLoadingView}>
                    <ActivityIndicator color="#00a8eb" size="large" />
                </View>
            );
        }
        else if ((links != null && links != undefined) && (links != null && links.next != null)) {
            return (
                <TouchableOpacity style={styles.loadMoreTxtView} onPress={() => this.loadMoreData()}>
                    <Text style={styles.loadMoreTxt}>Load More...</Text>
                </TouchableOpacity>
            )
        } else {
            return <View style={[styles.separatorLineStyle, { marginBottom: 30 }]} />
        }
    }

    render() {
        const { onContinue } = this.props;
        const { detoxSummaryList, loading } = this.state;
        return (
            <View style={styles.container}>
                {
                    loading ?
                        <View style={styles.loadingStyle}>
                            <ActivityIndicator size="large" color="#00a8eb" />
                        </View>
                        :
                        <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                            <Text style={styles.detoxTxt}>Your Detox</Text>
                            <FlatList
                                data={detoxSummaryList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderDetoxSummary(item, index)}
                                ItemSeparatorComponent={() => this.renderSeparator()}
                                ListEmptyComponent={() => this.listEmptyComponent()}
                                ListFooterComponent={() => this.renderFooter()}
                            />
                        </ScrollView>
                }
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default Detox;