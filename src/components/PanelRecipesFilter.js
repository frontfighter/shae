import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import Collapsible from 'react-native-collapsible';

const {height, width} = Dimensions.get('window');

class PanelRecipesFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      expanded: props.isExpanded,
      animation: new Animated.Value(38),
      isInitial: true,
      isMoreVisible: true
    };
  }

  componentDidMount() {
    console.log('this.state.minHeight', this.state.minHeight);
  }

  toggleExpanded = () => {
    try {
      if (this.state.isMoreVisible) {
        this.setState({ isMoreVisible: !this.state.isMoreVisible });
      } else {
        setTimeout(() => {this.setState({ isMoreVisible: !this.state.isMoreVisible })}, 130);
      }

      this.setState({ expanded: !this.state.expanded });
    } catch (err) {
      this.setState(() => { throw err; })
    }
  };


  render() {
    return (
      <View style={styles.container}>

        {(this.state.isMoreVisible) &&
          <View style={[styles.titleContainer, {marginTop: 11}]}>
            <TouchableWithoutFeedback
              onPress={this.toggleExpanded}
              disabled={this.props.isDisabled}
            >
              <View style={styles.buttonImage}>
                <Text style={styles.text}>See more</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        }

        <Collapsible collapsed={!this.state.expanded}>
          <View style={styles.body}>
            {this.props.children}
          </View>
        </Collapsible>

        {(this.state.expanded) &&
          <TouchableWithoutFeedback
            onPress={this.toggleExpanded}
            disabled={this.props.isDisabled}
          >
            <View style={[styles.buttonImage, {marginTop: 11}]}>
              <Text style={styles.text}>See less</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    flex: 1,
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'rgb(54,58,61)',
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.4,
    marginLeft: 16,
  },
  text: {
    color: 'rgb(0,168,235)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  button: {

  },
  buttonImage: {
    width: width - 48,
    alignItems: 'center',
    flexDirection: 'row'
  },
  body: {
  }
});

PanelRecipesFilter.defaultProps = {
  marginBottom: 15,
  handler: () => null,
  isDisabled: false,
  expanded: false
};

export default PanelRecipesFilter;
