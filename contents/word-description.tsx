import React from 'react';

import type { PlasmoCSConfig, PlasmoGetStyle } from 'plasmo';
import { Provider } from 'react-redux';
import { store } from './../store';
import { WordDescriptionCard } from './components/WordDescriptionCard';

import wordCardStyle from 'data-text:./styles/WordDiscriptionCard.scss';

/**
 * Plasmo configuration for the content script.
 */
export const config: PlasmoCSConfig = {
  matches: ['https://learn.microsoft.com/*']
};

// export const getOverlayAnchor: PlasmoGetOverlayAnchor = () =>
//   document.querySelector('.content') as HTMLElement;

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style');
  style.textContent += wordCardStyle;
  return style;
};

const PlasmoInline = () => {
  return (
    <Provider store={store}>
      <WordDescriptionCard />;
    </Provider>
  );
};

export default PlasmoInline;
