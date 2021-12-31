import React, { useState, useEffect, Component } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../components/Button';
import * as shaefitApi from "../../API/shaefitAPI";
import VideoPlayerModal from '../../components/VideoPlayerModal';

/*
* PersonalizedDetoxDailyRoutine screen design
*/

class PersonalizedDetoxDailyRoutine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            selectTab: { title: 'Day 1', name: 'Detox' },
            tabarray: [
                { title: 'Day 1', name: 'Detox' }, { title: 'Day 2', name: 'Optimize' }, { title: 'Day 3', name: 'Optimize' },
                { title: 'Day 4', name: 'Optimize' }, { title: 'Day 5', name: 'Detox' }, { title: 'Day 6', name: 'Optimize' },
                { title: 'Day 7', name: 'Optimize' }, { title: 'Day 8', name: 'Optimize' }, { title: 'Day 9', name: 'Optimize' },
                { title: 'Day 10', name: 'Detox' },
            ],
            dailyRoutineList: [],
            loading: false,
            loadMoreLoading: false,
            links: undefined,
            biotypeStatus: '',
            currentIndex: undefined,
            selectedItem: null,
            videoModal: false
        }
    }

    componentDidMount() {
        this.getUserDetails();
    }

    getUserDetails = async () => {
        this.setState({ userDetailsLoading: true });
        const userDetails = await shaefitApi.getUserDetails();
        this.setState({
            biotypeStatus: userDetails.biotypeStatus,
            userDetailsLoading: false,
        });
        this.getDailyRoutine(1, userDetails.biotypeStatus)
    };

    getDailyRoutine = async (day, biotypeStatus) => {
        try {
            this.setState({ loading: true })
            const response = await shaefitApi.getDailyroutine(day, 1, `999${biotypeStatus}`);
            this.setState({ loading: false, links: response.links })
            if (response && response.data && response.data.length > 0) {
                let temp = []
                response.data.map((item) => {
                    item.attributes && item.attributes.map((item) => temp.push(item))
                });
                this.setState({ dailyRoutineList: temp });
            }
        } catch (e) {
            this.setState({ loading: false })
        }
    }

    loadMoreData = async () => {
        try {
            const { links, activeIndex, biotypeStatus } = this.state;
            if ((links != null && links != undefined) && (links != null && links.next != null)) {
                let str = links.next.split("page=")[1]
                let currentPage = str.split("&")[0];
                this.setState({ loadMoreLoading: true })
                const response = await shaefitApi.getDailyroutine(activeIndex + 1, currentPage, `999${biotypeStatus}`);
                this.setState({ loadMoreLoading: false, links: response.links })
                if (response && response.data && response.data.length > 0) {
                    let temp = []
                    response.data.map((item) => {
                        item.attributes && item.attributes.map((item) => temp.push(item))
                    });
                    this.setState({ dailyRoutineList: [...this.state.dailyRoutineList, ...temp] });
                }
            }
        } catch (e) {
            this.setState({ loadMoreLoading: false })
        }
    }

    onPressItem = (item, index) => {
        this.getDailyRoutine(index + 1, this.state.biotypeStatus);
        this.setState({ activeIndex: index, selectTab: item });
    }

    renderTopBar = (item, index) => {
        const { activeIndex } = this.state;
        return (
            <TouchableOpacity style={[styles.tabRenderView, { marginLeft: index == 0 ? 20 : 0 }]} onPress={() => this.onPressItem(item, index)}>
                <View style={[styles.tabSelectionView, { borderBottomWidth: activeIndex === index ? 2 : 0 }]}>
                    <Text style={[styles.tabName, { color: activeIndex === index ? Colors.Montana : Colors.LightGray }]}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderDailyRoutineIcon = (type) => {
        switch (type.trim()) {
            case 'Move':
                return Icons.MoveManIcon;
            case 'Snack':
                return Icons.SnackAppleIcon;
            case 'Eat':
                return Icons.EatLunchIcon;
            case 'Fuel':
                return Icons.FuelIcon;
            case 'Rest':
                return Icons.MoonStarsIcon;
        }
    }

    handlePlayAndPause = (item, index) => {
        this.setState({ currentIndex: index, selectedItem: item, videoModal: true });
    };

    renderDailyRoutine = (item, index) => {
        const { dailyRoutineList, currentIndex } = this.state;
        return (
            <View style={CommonStyles.flexRow}>
                <Image style={styles.roundCircle} resizeMode='contain' source={this.renderDailyRoutineIcon(item.heading_sub)} />
                <View style={[styles.columnLineStyle, { borderLeftWidth: (dailyRoutineList.length - 1) == index ? 0 : 2 }]}>
                    <TouchableOpacity style={{ marginLeft: 39 }}>
                        <View style={CommonStyles.flex}>
                            <Text style={[styles.timeTxt, { color: item.color }]}>{item.heading}</Text>
                            <Text style={styles.nameTxt}>{item.heading_sub}</Text>
                            <Text style={styles.descTxt}>{item.text}</Text>
                        </View>
                        {
                            item.action_type == 'VIMEO_EMBED' && item.url != null &&
                            <TouchableOpacity onPress={() => this.handlePlayAndPause(item, index)}>
                                <Image source={Icons.FitnessImg} style={styles.videoContainer} />
                                <Image source={Icons.PlayBlueIcon} resizeMode="contain" style={styles.playImg} />
                            </TouchableOpacity>
                        }
                        {((dailyRoutineList.length - 1) !== index)
                            ? <View style={styles.separatorLineStyle} />
                            : <View style={{ marginBottom: 30 }} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
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

    render() {
        const { dailyRoutineList, tabarray, selectTab, loading, selectedItem, videoModal } = this.state;
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
                {
                    loading ?
                        <View style={styles.loadingStyle}>
                            <ActivityIndicator size="large" color="#00a8eb" />
                        </View>
                        :
                        <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                            <View style={styles.dailyRoutineContainer}>
                                <Text style={styles.dailyRoutineTxt}>Your Daily Routine: {selectTab && selectTab.title}</Text>
                                <View style={[styles.selectDayType, {
                                    backgroundColor: (selectTab && selectTab.name == 'Detox') ? Colors.AppleGreen : Colors.Coral,
                                }]}>
                                    <Text style={styles.dayTypeTxt}>{selectTab && selectTab.name}</Text>
                                </View>
                                <View style={CommonStyles.flex} />
                            </View>
                            <Text style={styles.dailyRoutineDesTxt}>Each day during your Detox you’ll have a simple schedule to follow for the day - just like the one below. </Text>
                            <FlatList
                                data={dailyRoutineList}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderDailyRoutine(item, index)}
                                ListFooterComponent={() => this.renderFooter()}
                            />
                        </ScrollView>
                }
                {videoModal &&
                    <VideoPlayerModal
                        isVisible={videoModal}
                        videoUrl={(selectedItem && selectedItem.url && selectedItem.url != null && selectedItem.url != undefined)
                            ? selectedItem.url.split("vimeo.com/")[1] : ''}
                        onVideoClosePress={() => this.setState({ videoModal: false, selectedItem: null })}
                    />
                }
            </View>
        )
    }
}

export default PersonalizedDetoxDailyRoutine;