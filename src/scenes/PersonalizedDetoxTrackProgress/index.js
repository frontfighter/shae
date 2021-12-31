import React, { useState, useEffect, Component } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, FlatList, Image, ScrollView, Platform } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../components/Button';
import Dialog, { DialogContent } from "react-native-popup-dialog";
import { Actions } from 'react-native-router-flux';

/*
* PersonalizedDetoxTrackProgress screen design
*/

class PersonalizedDetoxTrackProgress extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photoUri: '',
      photoFileName: '',
      takePhotoMsgModal: false,
      trackProgressList: [
        { title: '1. Upload Your "Before" Image Now', color: Colors.Primary, icon: Icons.ContactIcon, type: 'image', description: `You may see physical changes after your Detox - in your skin, size and shape and a picture speaks a thousand words! It's a great comparison strategy to help reward yourself when you're done!` },
        { title: '2. How are you feeling?', color: Colors.Cranberry, icon: Icons.FeelingIcon, type: '', description: `Complete the "How are you feeling?" quiz. This gives you a baseline for things like mood, sleep and energy levels.` },
        {
          title: '3. Track Your Measurements', color: Colors.MediumSlateBlue, icon: Icons.measurement, type: 'array', description: `Which measurements would you like to track? We all store energy as fat in different ways.`,
          data: [
            { title: 'Chest', check: true, des: ' - The circumference under the arms and above the breasts and pectoral muscles.' },
            { title: 'Ribs', check: false, des: ' - The area just under your chest and above your waist (this is generally the bra line for ladies).' },
            { title: 'Waist', check: false, des: ' - The space between your ribs and your hips (your belly).' },
            { title: 'Glutes', check: false, des: ' - The largest circumference of your butt.' },
            { title: 'Thigh', check: false, des: ' - The thickness of your leg halfway between your hip and your knee. ' },
            { title: 'BMI', check: true, des: ` - Body Mass Index (BMI) is a value calculated from a person's weight and height and therefore provides a better understanding of a person's overall mass than weight alone.` },
            { title: 'BFI', check: false, des: ` - Body Fat Index (BFI) can be used to estimate your total percentage of body fat based on your size. This calculation is based on the U.S. Navy Method of calculating BFI based on measurements.` },
            { title: 'Lean Bodyweight', check: true, des: ' - Lean Muscle Weight (or Lean Body Weight) is the calculation of the total weight of your body minus its estimated fat content.' },
            { title: 'Water Weight', check: false, des: ` - The amount of water in a person's body is difficult to determine accurately without special equipment. This calculation uses the Hume-Weyers formula and is measured in liters.` },
            { title: 'Healthy Habits Index', check: true, des: ` - The Healthy Habits Index is calculated based on overall results from your BMI, BFI, Water Content, Lean Body Weight, lifestyle habits and choices, health risks and other factors. A unique algorithm that weighs each of these components provides you a general idea of your overall healthy habits level.` },
          ]
        },
      ]
    }
  }

  onChecklist = (item, index, mainIndex) => {
    let tempArray = this.state.trackProgressList;
    tempArray[mainIndex].data[index].check = !item.check;
    this.setState({ trackProgressList: tempArray });
  }

  renderMeasurements = (item, index, mainIndex) => {
    return (
      <View key={index} style={[styles.measurementsView, { marginTop: index == 0 ? 30 : 10 }]}>
        <TouchableOpacity onPress={() => this.onChecklist(item, index, mainIndex)}>
          <Image source={item.check ? Icons.SquareCheckIcon : Icons.SquareUnCheckIcon} style={[styles.checkboxStyle, { tintColor: item.check ? Colors.AppleGreen : '#b5b8bb' }]} />
        </TouchableOpacity>
        <View style={styles.measurementsDesView}>
          <Text style={styles.measurementsDesTxt}><Text style={styles.measurementsTitleTxt}>{item.title}</Text>{item.des}</Text>
        </View>
      </View>
    )
  }

  renderTrackProgress = (item, i) => {
    return (
      <View key={i}>
        <View style={styles.trackProgressRenderView}>
          <Image source={item.icon} style={styles.renderImg} />
          <View style={CommonStyles.flexOne}>
            <Text style={styles.trackTitle}>{item.title}</Text>
            <View style={[CommonStyles.flexRow, { flexWrap: 'wrap' }]}>
              <Text style={styles.measurementsDesTxt}>{item.description} </Text>
              <View style={styles.tipsView}>
                <Text style={styles.tipsTxt}>Tip</Text>
              </View>
            </View>
            {
              item.type == 'image' &&
              <TouchableOpacity activeOpacity={1} style={styles.uploadView}>
                <Image source={Icons.CloudIcon} resizeMode="contain" style={styles.uploadImg} />
                <Text style={styles.uploadTxt}>Upload Image</Text>
              </TouchableOpacity>
            }
            {this.state.photoUri != '' && <Image source={{ uri: this.state.photoUri }} style={{ height: 50, width: 50 }} />}
            {
              (item.type == 'array') && (item.data && item.data.length > 0) &&
              <FlatList
                data={item.data}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => this.renderMeasurements(item, index, i)}
              />
            }
          </View>
          {item.type == '' && <Image source={Icons.ArrowGrayRightIcon} resizeMode='contain' style={styles.rightArrowStyle} />}
        </View>
        <View style={styles.separatorLineStyle} />
      </View>
    )
  }

  onTrackComplete = () => {
    this.setState({ takePhotoMsgModal: false });
    Actions.PersonalizedDetoxDailyRoutine();
  }

  render() {
    const { trackProgressList } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
          <Text style={styles.trackProgressTxt}>Let’s track your progress!</Text>
          <Text style={styles.trackProgressDesTxt}>Tracking different aspects of your lifestyle helps you see the changes that occur during your Detox... from your mood to the size of your butt!  This tracking is for you Who doesn't love a good before and after story? This will help you see your results instantly when you finish your 10 Days!</Text>
          <FlatList
            data={trackProgressList}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => this.renderTrackProgress(item, index)}
          />
        </ScrollView>
        <CustomButton title="Continue" onPress={() => this.setState({ takePhotoMsgModal: true })} />
        <Dialog
          visible={this.state.takePhotoMsgModal}
          onDismiss={() => { this.setState({ takePhotoMsgModal: false }); }}
          hasOverlay={false}
          dialogStyle={styles.photoModalView}
        >
          <DialogContent>
            <View style={styles.modalSubView}>
              <Text style={styles.photoMsg}>Take your photo now even if you're feeling a little low or self-conscious. No-one will see the photo except you (If you want to share them at the end of your Detox you must give permission). Upload it later if you like but take it today so you get a real comparison! </Text>
              <View style={styles.modalSeparatorLine} />
              <TouchableWithoutFeedback
                onPress={() => this.onTrackComplete()}>
                <Text style={styles.okTxt}>Okay</Text>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    )
  }
}

export default PersonalizedDetoxTrackProgress;