import React, { Component } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import * as shaefitApi from "../../../API/shaefitAPI";
import VideoPlayerModal from '../../../components/VideoPlayerModal';

/*
* DailyRoutines screen design
*/

class DailyRoutines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dayRoutines: [],
            loading: false,
            loadMoreLoading: false,
            links: undefined,
            currentIndex: undefined,
            selectedItem: null,
            videoModal: false
        }
    }

    componentDidMount() {
        this.getDailyRoutine(1)
    }

    getDailyRoutine = async (day) => {
        try {
            this.setState({ loading: true })
            const response = await shaefitApi.getDailyroutine(undefined, 1, `999${this.props.biotypeStatus}`);
            this.setState({ loading: false, links: response.links })
            if (response && response.data && response.data.length > 0) {
                let temp = []
                response.data.map((item) => {
                    item.attributes && item.attributes.map((item) => temp.push(item))
                });
                this.setState({ dayRoutines: temp });
            }
        } catch (e) {
            this.setState({ loading: false })
        }
    }

    handlePlayAndPause = (item, index) => {
        this.setState({ currentIndex: index, selectedItem: item, videoModal: true });
    };

    renderDailyRoutineIcon = (type) => {
        switch (type) {
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

    renderDayRoutines = (item, index) => {
        const { dayRoutines, currentIndex } = this.state;
        return (
            <View style={CommonStyles.flexRow}>
                <Image style={styles.roundCircle} resizeMode='contain' source={this.renderDailyRoutineIcon(item.heading_sub)} />
                <View style={[styles.columnLineStyle, { borderLeftWidth: (dayRoutines.length - 1) == index ? 0 : 2 }]}>
                    <TouchableOpacity style={{ marginLeft: 39 }}>
                        <View style={CommonStyles.flex}>
                            <Text style={styles.timeTxt}>{item.heading}</Text>
                            <Text style={styles.nameTxt}>{item.heading_sub}</Text>
                            <Text style={styles.descTxt}>{item.text}</Text>
                        </View>
                        {
                            item.action_type == 'VIMEO_EMBED' && item.url != null &&
                            <TouchableOpacity onPress={() => this.handlePlayAndPause(item, index)}>
                                <Image source={Icons.FitnessImg} style={styles.videoContainer} />
                                <Image source={Icons.PlayIcon} style={styles.playImg} />
                            </TouchableOpacity>
                        }
                        <View style={styles.separatorLineStyle} />
                    </TouchableOpacity>
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
                const response = await shaefitApi.getDailyroutine(undefined, currentPage, `999${this.props.biotypeStatus}`);
                this.setState({ loadMoreLoading: false, links: response.links })
                if (response && response.data && response.data.length > 0) {
                    let temp = []
                    response.data.map((item) => {
                        item.attributes && item.attributes.map((item) => temp.push(item))
                    });
                    this.setState({ dayRoutines: [...this.state.dayRoutines, ...temp] });
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
            <Text>No daily routines found</Text>
        )
    }

    render() {
        const { onContinue } = this.props;
        const { dayRoutines, loading, selectedItem, videoModal } = this.state;
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
                            <Text style={styles.dayScheduleDecTxt}>Each day during your Detox you’ll have a simple schedule to follow for the day - just like the one below.</Text>
                            <FlatList
                                data={dayRoutines}
                                style={{ marginBottom: 30 }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderDayRoutines(item, index)}
                                ListFooterComponent={() => this.renderFooter()}
                                ListEmptyComponent={() => this.listEmptyComponent()}
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
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default DailyRoutines;