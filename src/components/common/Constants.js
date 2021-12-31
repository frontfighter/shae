import { Dimensions } from 'react-native'

const Constants = {
  Screen: {
    PersonalizedDetox: 'PersonalizedDetox',
    PersonalizedDetoxDetails: 'PersonalizedDetoxDetails',
  },
  ScreenSize: Dimensions.get('window'),
  FontSize: {
    superTiny: 5,
    tiny: 10,
    small: 15,
    medium: 18,
    big: 25,
    large: 30,
    extraLarge: 35,
    xxLarge: 40,
    xxxLarge: 45,
  },
  Preferences: {
    User: 'user',
  },
  //font family Name
  FontFamily: {
    SFProTextSemibold : 'SFProText-Semibold',
    SFProTextRegular: 'SFProText-Regular',
    SFProTextBold: 'SFProText-Bold',
    SFProTextMedium: 'SFProText-Medium'
  },
  //regular expressions
  Emailreg : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})+$/,
  PasswordReg : /^[A-Za-z]+$/,
  NameReg : /^[ A-Za-z]+$/,
}

export default Constants;
