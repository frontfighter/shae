import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import * as shaefitApi from "../../../API/shaefitAPI";
import VideoPlayerModal from '../../../components/VideoPlayerModal';

/*
* TopTips screen design
*/

class TopTips extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topTipsDoList: [],
            topTipsDoNotList: [],
            loading: false,
            links: undefined,
            loadMoreLoading: false,
            videoModal: false
        }
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true })
            const response = await shaefitApi.getToptips(1, `999${this.props.biotypeStatus}`);
            this.setState({ loading: false, links: response.links })
            if (response && response.data && response.data.length > 0) {
                let temp = []
                response.data.map((item) => {
                    item.attributes && item.attributes.map((item) => temp.push(item))
                });
                let DoData = temp.filter((item) => item.type == 'DO');
                let DoNotData = temp.filter((item) => item.type == `DON'T`);
                console.log('DoData', DoData, DoNotData)
                this.setState({ topTipsDoList: DoData, topTipsDoNotList: DoNotData });
            }
        } catch (e) {
            this.setState({ loading: false })
        }
    }

    loadMoreData = async () => {
        try {
            const { links } = this.state;
            if ((links != null && links != undefined) && (links != null && links.next != null)) {
                let str = links.next.split("page=")[1]
                let currentPage = str.split("&")[0];
                this.setState({ loadMoreLoading: true })
                const response = await shaefitApi.getToptips(currentPage, `999${this.props.biotypeStatus}`);
                this.setState({ loadMoreLoading: false, links: response.links })
                if (response && response.data && response.data.length > 0) {
                    let temp = []
                    response.data.map((item) => {
                        item.attributes && item.attributes.map((item) => temp.push(item))
                    });
                    let DoData = temp.filter((item) => item.type == 'DO');
                    let DoNotData = temp.filter((item) => item.type == `DON'T`);
                    this.setState({
                        topTipsDoList: [...this.state.topTipsDoList, ...DoData],
                        topTipsDoNotList: [...this.state.topTipsDoNotList, ...DoNotData]
                    });
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

    renderDoTopTips = (item, index) => {
        return (
            <View key={index} style={styles.topTipsRenderView}>
                <Image source={Icons.TickCheckIcon} style={styles.checkboxStyle} resizeMode="contain" />
                <View style={styles.topTipsNameView}>
                    <Text style={styles.topTipsNameTxt}>{item.text}</Text>
                </View>
            </View>
        )
    }

    renderDontTopTips = (item, index) => {
        return (
            <View key={index} style={styles.topTipsRenderView}>
                <Image source={Icons.CloseIcon} style={styles.closeStyle} resizeMode="contain" />
                <View style={styles.topTipsNameView}>
                    <Text style={styles.topTipsNameTxt}>{item.text}</Text>
                </View>
            </View>
        )
    }


    listEmptyComponent = (type) => {
        return (
            <Text>No {type} list found</Text>
        )
    }

    render() {
        const { onContinue } = this.props;
        const { topTipsDoList, topTipsDoNotList, loading, videoModal } = this.state;
        return (
            <View style={styles.container}>
                {
                    loading ?
                        <View style={styles.loadingStyle}>
                            <ActivityIndicator size="large" color="#00a8eb" />
                        </View>
                        :
                        <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                            <Text style={styles.topTipsTxt}>Top Tips & Troubleshooting</Text>
                            <TouchableOpacity style={styles.imgContainer} onPress={() => this.setState({ videoModal: true })}>
                                <Image source={Icons.SensorImg} style={styles.imgStyle} />
                            </TouchableOpacity>
                            <View style={styles.doContainer}>
                                <Text style={styles.nameTxt}>Do’s</Text>
                                <FlatList
                                    data={topTipsDoList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => this.renderDoTopTips(item, index)}
                                    ListEmptyComponent={() => this.listEmptyComponent('Do')}
                                    ListFooterComponent={() => this.renderFooter()}
                                />
                            </View>
                            <View style={styles.dontContainer}>
                                <Text style={styles.nameTxt}>Don’t</Text>
                                <FlatList
                                    data={topTipsDoNotList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => this.renderDontTopTips(item, index)}
                                    ListEmptyComponent={() => this.listEmptyComponent(`Don't`)}
                                    ListFooterComponent={() => this.renderFooter()}
                                />
                            </View>
                        </ScrollView>
                }
                {videoModal &&
                    <VideoPlayerModal
                        isVisible={videoModal}
                        videoUrl="285575889"
                        onVideoClosePress={() => this.setState({ videoModal: false })}
                    />
                }
                <CustomButton title="Continue" onPress={() => onContinue()} />
            </View>
        )
    }
}

export default TopTips;