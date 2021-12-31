import { StyleSheet } from 'react-native';
import { Colors } from '@common';

const styleSheet = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer: {
        backgroundColor: Colors.AliceBlue,
        height: 48,
        borderBottomColor: Colors.Quartz,
        borderBottomWidth: 1 
    },
    tabRenderView: {
        height: 48,
        marginRight: 20,
    },
    tabSelectionView: {
        flexDirection: 'row',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.Primary,
    },
    tabName: {
        fontSize: 14,
        color: Colors.Black,
    }
})

export default styleSheet;