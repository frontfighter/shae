// @flow

import styled from 'styled-components';
import { Platform } from 'react-native';
import Button from '../Touchable';
import type { StyleObj } from '../../lib/definitions';

type TabBodyProps = {
  tabHeight: number,
};

export const TabBody = styled.View`
  height: ${(props: TabBodyProps) => props.tabHeight};
  align-items: center;
  justify-content: center;
`;

type TabButtonProps = {
  // tabWidth: number,
};

export const TabButton = styled(Button)`
  width: ${(props: TabButtonProps) => (props.tabWidth === 0) ? 'null' : props.tabWidth};
`;

type TabTextProps = {
  color: string,
};

export const Divider = styled.View`
  height: 20;
  width: 0.5;
  background-color: 'rgb(223,230,235)';
  align-self: center;
`;

export const TabText = styled.Text`
  color: ${(props: TabTextProps) => props.color};
  font-weight: ${Platform.OS === 'ios' ? 500 : 400};
  font-family: ${Platform.OS === 'android' ? 'sans-serif-medium' : 'System'};
  font-size: 14;
  text-align: center;
  min-width: 100%;
  marginHorizontal: ${(props: TabButtonProps) => (props.tabWidth === 0) ? 30 : 0};
`;
