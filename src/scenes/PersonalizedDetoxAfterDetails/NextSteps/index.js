import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';

/*
* NextSteps screen design
*/

class NextSteps extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stepList: [
                { check: false, name: 'Eat the foods that are right for your body - just because you don’t put on weight easily doesn’t mean that your body works well on bad or junk foods. You’ll notice a huge difference in your energy adn digestion when you eat the foods that are right for you.' },
                { check: true, name: 'Cook your foods, eat them warm and help your delicate digestive system to do its job.' },
                { check: true, name: 'Don’t forget to eat! It’s easy to get distrated and forget but remember the analogy of the solar powered car - your body needs the fuel to function properly.' },
                { check: false, name: 'Keep your cupboards and refrigerator well-stocked with your highly ranked foods.' },
                { check: false, name: `Avoid buying things at the grocery store that are ranked as RED on your list - keep these for a special occassion or to share with someone else. If you have a full packet of something in the cupboard or fridge it might be diffiult to resist the temptatoin to just 'eat them all' so you don't need to look at them every time!` },
                { check: false, name: 'Check you food list often so you always know which foods to indulge in and which to avoid.' },
                { check: false, name: 'Treat your body with an activity that helps it to relax at least once a week when you can! Spend some time alone, read your book, go to a spa or take a stroll down your favourite street.' },
                { check: true, name: 'Stay connected with your Detox tribe to share your support and keep updated with Personalized Detoxing news!' },
                { check: false, name: 'Mange your Detox preferences so you always know when is the best time for you to Detox! ' },
            ]
        }
    }

    onChecklist = (item, index) => {
        let tempArray = this.state.stepList;
        tempArray[index].check = !item.check;
        this.setState({ stepList: tempArray });
    }

    renderNextStepsChecklist = (item, index) => {
        const { stepList } = this.state;
        return (
            <View key={index} style={{ flexDirection: 'row', borderColor: Colors.LavenderGray, borderWidth: 1,
             backgroundColor: Colors.White, padding: 16, marginBottom: (stepList.length - 1) == index ? 30 : 10 }}>
                <TouchableOpacity onPress={() => this.onChecklist(item, index)}>
                    <Image source={item.check ? Icons.SquareCheckIcon : Icons.SquareUnCheckIcon} style={[styles.checkboxStyle, { tintColor: item.check ? Colors.AppleGreen : '#b5b8bb' }]} />
                </TouchableOpacity>
                <Text style={styles.renderTitleTxt}>{item.name}</Text>
            </View>
        )
    }

    render() {
        const { stepList } = this.state;
        const { onContinue } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                    <Text style={styles.titleTxt}>Integrating back into everyday life</Text>
                    <Text style={styles.descriptionTxt}>Now is certainly not the time to stop feeling great <Text style={styles.nameTxt}>Rebecca!</Text> Let’s keep this momentum going!  </Text>
                    <FlatList
                        data={stepList}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this.renderNextStepsChecklist(item, index)}
                    />
                </ScrollView>
                {/* <CustomButton title="Continue" onPress={() => onContinue()} /> */}
            </View>
        )
    }
}

export default NextSteps;