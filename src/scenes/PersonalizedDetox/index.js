import React, { Component } from 'react';
import { View, Text, Linking, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import CustomButton from '../../components/Button';
import styles from './style';
import { Actions } from 'react-native-router-flux';
import * as shaefitApi from "../../API/shaefitAPI";

/*
* PersonalizedDetox screen design
*/

class PersonalizedDetox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userDetailsLoading: false,
            biotypeStatus: ''
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
    };


    renderImage = (item, index) => {
        return (
            <Image
                source={item.img}
                style={{ margin: 5, height: item.height, width: item.width }} />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.welcomeTxt}>Welcome to your Personalized Detox!</Text>
                    <Text style={styles.threeStepsTxt}>3 simple steps to get started on your full body Detox!</Text>
                    <View style={{ marginBottom: 15, marginTop: 30 }}>
                        <FlatList
                            scrollEnabled={false}
                            data={[
                                { img: Icons.Detox1Img, height: 100, width: '50%' },
                                { img: Icons.Detox2Img, height: 98, width: '25%' },
                                { img: Icons.Detox3Img, height: 79, width: '25%' },
                                { img: Icons.Detox4Img, height: 79, width: '20%' },
                                { img: Icons.Detox5Img, height: 98, width: '30%' },
                                { img: Icons.Detox6Img, height: 100, width: '50%' }
                            ]}
                            numColumns={3}
                            keyExtractor={(item, index) => item.toString() + index}
                            bounces={false}
                            renderItem={({ item, index }) => this.renderImage(item, index)}
                        />
                    </View>
                    <View style={CommonStyles.flexOne}>
                        <View style={styles.mainStepsView}>
                            <View style={styles.ovalView}>
                                <Text style={styles.ovalText}>1</Text>
                            </View>
                            <View style={CommonStyles.flexOne}>
                                <Text style={styles.detoxStepsTitle}>Get Connected</Text>
                                <Text style={styles.detoxDescriptionTxt}>Get connected to your support</Text>
                                <TouchableOpacity onPress={() => Linking.openURL("https://www.facebook.com/groups/PersonalizedDetox")}>
                                    <Text style={styles.fbGroupTxt}>FB group.</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.separatorLineStyle} />
                        <View style={styles.mainStepsView}>
                            <View style={styles.ovalView}>
                                <Text style={styles.ovalText}>2</Text>
                            </View>
                            <View style={CommonStyles.flexOne}>
                                <Text style={styles.detoxStepsTitle}>Get Prepared</Text>
                                <Text style={styles.detoxDescriptionTxt}>Start preparing for your Personalized Detoxing!</Text>
                            </View>
                        </View>
                        <View style={styles.separatorLineStyle} />
                        <View style={styles.mainStepsView}>
                            <View style={styles.ovalView}>
                                <Text style={styles.ovalText}>3</Text>
                            </View>
                            <View style={CommonStyles.flexOne}>
                                <Text style={styles.detoxStepsTitle}>Get Detoxing</Text>
                                <Text style={styles.detoxDescriptionTxt}>When you are ready to start your Detox, click the “Start My Detox” button. Once you hit “start” Shae will keep you in the moment and focused each day with your tailored Detox notifications. <Image source={Icons.InformationIcon} style={{ height: 14, width: 14 }}></Image></Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <CustomButton title="Start My Detox" onPress={() => Actions.PersonalizedDetoxDetails({ biotypeStatus: this.state.biotypeStatus })} />
            </View>
        )
    }
}

export default PersonalizedDetox;