import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Slider from 'react-native-slider-custom';

const {height, width} = Dimensions.get('window');

const SliderPhotoComponent = (props) => {
  let dividers = [];
  for (let i = 0; i < 30; i++) {
    dividers.push(
      <View
        key={i.toString()}
        style={{
          marginLeft: i === 0 ? 12 : 0,
          marginRight: i === 29 ? 12 : 0,
          marginTop: 4,
          width: 2,
          height: 8,
          borderRadius: 4.5,
          backgroundColor: 'rgba(255,255,255,0.5)',
        }}
      />,
    );
  }

  return (
    <View
      style={{
        // marginTop: props.marginTop,
        transform: [{rotate: '90deg'}],
        position: 'absolute',
        top: 0,
        left: 0,
      }}>
      <Slider
        minimumValue={0}
        maximumValue={180}
        step={1}
        trackStyle={{width: width - 40, height: 16, borderRadius: 8}}
        thumbStyle={{bottom: 6, width: 28, height: 28, left: 0, elevation: 3}}
        style={{height: 28}}
        value={props.value}
        // onValueChange={(value) => props.onValueChange(value)}
        customMinimumTrack={
          // () => null
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[
              'rgb(235,32,37)',
              'rgb(255,235,41)',
              'rgb(109,239,111)',
              'rgb(255,235,41)',
              'rgb(235,32,37)',
            ]}
            style={{
              width: width - 40,
              height: 16,
              borderRadius: 8,
            }}>
            <View
              style={{
                width: width - 40,
                position: 'absolute',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              {dividers}
            </View>
          </LinearGradient>
          // <View style={{ backgroundColor: "transparent", width: 0 }} />
        }
        customMaximumTrack={
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[
              'rgb(235,32,37)',
              'rgb(255,235,41)',
              'rgb(109,239,111)',
              'rgb(255,235,41)',
              'rgb(235,32,37)',
            ]}
            style={{
              width: width - 40,
              height: 16,
              borderRadius: 8,
            }}>
            <View
              style={{
                width: width - 40,
                height: 20,
                position: 'absolute',
              }}>
              <View
                style={{
                  width: 8,
                  height: 2,
                  borderRadius: 4.5,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                }}
              />
              <View
                style={{
                  marginTop: 4,
                  width: 2,
                  height: 8,
                  borderRadius: 4.5,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                }}
              />
              <View
                style={{
                  marginRight: 12,
                  marginTop: 4,
                  width: 2,
                  height: 8,
                  borderRadius: 4.5,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                }}
              />
            </View>
            {Platform.OS === 'android' && (
              <View
                style={{
                  width: width - 40,
                  position: 'absolute',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  zIndex: 9999,
                }}>
                {dividers}
              </View>
            )}
          </LinearGradient>
        }
        customThumb={
          <Image
            source={require('../resources/icon/select_photo.png')}
            style={[
              {
                alignSelf: 'center',
              },
              Platform.OS === 'android' && {
                zIndex: 9999,
                width: 28,
                height: 28,
                bottom: -8,
              },
            ]}
          />
        }
      />
      {/*<View style={{ marginTop: 4 }}>
        <Text style={[styles.text, { left: 0 }]}>{props.minText}</Text>
        <Text style={[styles.text, { right: 0 }]}>{props.maxText}</Text>
      </View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgb(141,147,151)',
    position: 'absolute',
  },
});

export default SliderPhotoComponent;
