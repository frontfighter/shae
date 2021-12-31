import React, { useState, useEffect, useRef, Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import * as shaefitApi from "../../../API/shaefitAPI";

/*
* PreDetoxChecklist screen design
*/

class PreDetoxChecklist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            preDetoxChecklistList: [],
            loading: false,
            links: undefined,
            loadMoreLoading: false
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            const response = await shaefitApi.getPrechecklist(1, `999${this.props.biotypeStatus}`);
            this.setState({ loading: false, links: response.links })
            if (response && response.data && response.data.length > 0) {
                let temp = []
                response.data.map((item) => {
                    item.attributes && item.attributes.map((item) => temp.push({ ...item, check: false }))
                });
                this.setState({ preDetoxChecklistList: temp });
            }
        } catch (e) {
            this.setState({ loading: false })
        }
    }

    onChecklist = (item, index) => {
        let tempArray = this.state.preDetoxChecklistList;
        tempArray[index].check = !item.check;
        this.setState({ preDetoxChecklistList: tempArray });
    }

    renderPreDetoxChecklist = (item, index) => {
        return (
            <View key={index}>
                <View style={CommonStyles.flexRow}>
                    <TouchableOpacity onPress={() => this.onChecklist(item, index)}>
                        <Image source={item.check ? Icons.SquareCheckIcon : Icons.SquareUnCheckIcon} style={[styles.checkboxStyle, { tintColor: item.check ? Colors.AppleGreen : '#b5b8bb' }]} />
                    </TouchableOpacity>
                    <View style={styles.preDetoxView}>
                        <Text style={styles.nameTxt}>{item.text}</Text>
                        {item.text_long && <Text style={styles.descTxt}>{item.text_long}</Text>}
                        {item.text_success && <Text style={styles.wellTxt}>{item.text_success}</Text>}
                    </View>
                </View>
            </View>
        )
    }

    loadMoreData = async () => {
        try {
            const { links } = this.state;
            if ((links != null && links != undefined) && (links != null && links.next != null)) {
                let str = links.next.split("page=")[1]
                let currentPage = str.split("&")[0];
                this.setState({ loadMoreLoading: true })
                const response = await shaefitApi.getPrechecklist(currentPage, `999${this.props.biotypeStatus}`);
                this.setState({ loadMoreLoading: false, links: response.links })
                if (response && response.data && response.data.length > 0) {
                    let temp = []
                    response.data.map((item) => {
                        item.attributes && item.attributes.map((item) => temp.push(item))
                    });
                    this.setState({ preDetoxChecklistList: [...this.state.preDetoxChecklistList, ...temp] });
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
            return <View />
        }
    }

    listEmptyComponent = () => {
        return (
            <Text>No predetox check list found</Text>
        )
    }

    render() {
        const { onContinue } = this.props;
        const { preDetoxChecklistList, loading } = this.state;
        return (
            <View style={styles.container}>
                {
                    loading ?
                        <View style={styles.loadingStyle}>
                            <ActivityIndicator size="large" color="#00a8eb" />
                        </View>
                        :
                        <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                            <Text style={styles.checklistTxt}>Pre-Detox Checklist</Text>
                            <Text style={styles.checklistDecTxt}>Here is a helpful checklist to help you get started:</Text>
                            <FlatList
                                data={preDetoxChecklistList}
                                style={{ marginBottom: 20 }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderPreDetoxChecklist(item, index)}
                                ItemSeparatorComponent={() => <View style={styles.separatorLineStyle} />}
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

export default PreDetoxChecklist;