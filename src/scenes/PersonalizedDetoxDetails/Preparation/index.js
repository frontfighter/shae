import React, { Component } from 'react';
import { View, Text, SafeAreaView, Dimensions, FlatList, Image, ScrollView, ActivityIndicator, TouchableOpacity, Touchable } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import * as shaefitApi from "../../../API/shaefitAPI";
import VideoPlayerModal from '../../../components/VideoPlayerModal';

/*
* Preparation screen design
*/
const { height, width } = Dimensions.get('window');
class Preparation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            preparationList: [],
            links: undefined,
            loadMoreLoading: false,
            currentIndex: undefined,
            loading: false,
            selectedItem: null,
            videoModal: false
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            const response = await shaefitApi.getPreparationVideo(1);
            this.setState({ loading: false, links: response.links })
            if (response && response.data && response.data.length > 0) {
                let temp = []
                response.data.map((item) => {
                    item.attributes && item.attributes.map((item) => temp.push(item))
                });
                this.setState({ preparationList: temp });
            }
        } catch (e) {
            this.setState({ loading: false })
        }
    }

    renderSeparator = () => {
        return (<View style={styles.separatorLineStyle} />)
    };

    listEmptyComponent = () => {
        return (
            <Text>No preparation list found</Text>
        )
    }

    handlePlayAndPause = (item, index) => {
        this.setState({ currentIndex: index, selectedItem: item, videoModal: true });
    };

    renderPreparation = (item, index) => {
        const { currentIndex } = this.state;
        return (
            <View key={index}>
                {
                    item.video_url != null &&
                    <TouchableOpacity onPress={() => this.handlePlayAndPause(item, index)}>
                        <Image source={Icons.SensorImg} style={styles.videoImg} />
                    </TouchableOpacity>
                }
                <Text style={styles.nameTxt}>{item.title}</Text>
                {item.spiel && <Text style={styles.descTxt}>{item.spiel}</Text>}
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
                const response = await shaefitApi.getPreparationVideo(currentPage);
                this.setState({ loadMoreLoading: false, links: response.links })
                if (response && response.data && response.data.length > 0) {
                    let temp = []
                    response.data.map((item) => {
                        item.attributes && item.attributes.map((item) => temp.push(item))
                    });
                    this.setState({ preparationList: [...this.state.preparationList, ...temp] });
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
        const { preparationList, loading, videoModal, selectedItem } = this.state;
        return (
            <View style={styles.container}>
                {
                    loading ?
                        <View style={styles.loadingStyle}>
                            <ActivityIndicator size="large" color="#00a8eb" />
                        </View>
                        :
                        <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                            <Text style={styles.prepareTxt}>Getting Prepared!</Text>
                            <Text style={styles.prepareDecTxt}>{`Being prepared can help your Detox go as smoothly as a river pebble.
                                \nEach day you can follow your Daily schedule to help support your body best and Shae will help you stay on track with notifications.
                                \nGrab a cup of tea and watch these short videos from your team to help you get prepared for what’s coming!`}</Text>
                            <FlatList
                                data={preparationList}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderPreparation(item, index)}
                                ItemSeparatorComponent={() => this.renderSeparator()}
                                ListEmptyComponent={() => this.listEmptyComponent()}
                                ListFooterComponent={() => this.renderFooter()}
                            />
                        </ScrollView>
                }
                {videoModal &&
                    <VideoPlayerModal
                        isVisible={videoModal}
                        videoUrl={(selectedItem && selectedItem.video_url && selectedItem.video_url != null && selectedItem.video_url != undefined)
                            ? selectedItem.video_url.split("vimeo.com/")[1] : ''}
                        onVideoClosePress={() => this.setState({ videoModal: false, selectedItem: null })}
                    />
                }
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default Preparation;