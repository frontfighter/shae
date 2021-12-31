import React, { Component } from "react";
import { View, Text, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import styles from './style';
import Modal from "react-native-modal";
import Video from "react-native-video";
import * as shaefitApi from "../../API/shaefitAPI";
import {isIphoneX} from 'react-native-iphone-x-helper';

class VideoPlayerModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            videoUrl: ''
        }
    }

    componentDidMount() {
        const { videoUrl } = this.props; 
        this.getVimeoUrlsCallApi(videoUrl);
    }

    getVimeoUrlsCallApi = async (videoUrl) => {
        if (videoUrl) {  
            let vimeoId = videoUrl != '' ? videoUrl.split("/")[0] : '';
            this.setState({ loading: true })
            let response = await shaefitApi.getVimeoUrls(vimeoId);
            this.setState({ loading: false, videoUrl: (response && response != null && (typeof response === 'object') && response["720p"]) ? response["720p"].url : '' });
        }
    }

    onEnd = () => {
        this.props.onVideoClosePress();
    }

    render() {
        const { isVisible, onVideoClosePress } = this.props;
        const { loading, videoUrl } = this.state;
        return (
            <Modal
                style={styles.modalOptions}
                style={{ margin: 0 }}
                isVisible={isVisible}
                onBackButtonPress={() => onVideoClosePress()}
            >
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', marginTop: isIphoneX() ? 40 : 20 }}>
                        <View style={{ flex: 1 }} />
                        <TouchableWithoutFeedback onPress={() => onVideoClosePress()}>
                            <Text style={{ padding: 5, color: '#fff' }}>Close</Text>
                        </TouchableWithoutFeedback>
                        <View style={{ width: 10 }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {
                            loading ?
                                <View style={styles.loadingStyle}>
                                    <ActivityIndicator size="large" color="#fff" />
                                </View>
                                :
                                videoUrl != '' ?
                                    <Video
                                        source={{ uri: videoUrl }}
                                        ref={(ref) => {
                                            this.player = ref;
                                        }}
                                        repeat
                                        volume={1.0}
                                        resizeMode="contain"
                                        shouldPlay
                                        controls={true}
                                        onEnd={this.onEnd}
                                        style={styles.videoImg}
                                    />
                                    :
                                    <View>
                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>No video available</Text>
                                    </View>
                        }
                    </View>
                </View>
            </Modal>
        )
    }
}

export default VideoPlayerModal;