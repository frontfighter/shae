import React, { Component, Fragment } from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import styles from './style';
import PropTypes from 'prop-types';

/**
 * Common component for custom button
 * @param {title} param0 method which is use to display text.
 * @param {onPress} param1 which is use to onpress click event.
 * @param {disabled} param2 which is use to disabled for touchable opacity button.
 */

class CustomButton extends Component {

    render() {
        const { title, onPress, containerStyle, disabled, textStyle, icon, imgStyle } = this.props;
        const { button, buttonLabel, iconStyle } = styles;
        return (
            <Fragment>
                <TouchableOpacity activeOpacity={1} disabled={disabled} onPress={() => onPress && onPress()} style={[button, containerStyle]}>
                    {icon && <Image source={icon} style={[iconStyle, imgStyle]} />}
                    <Text style={[buttonLabel, textStyle]}>{title}</Text>
                </TouchableOpacity>
            </Fragment>
        )
    }
}

CustomButton.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool
}

export default CustomButton;