import React from 'react';

import type { PlasmoCSConfig, PlasmoGetStyle } from 'plasmo';
import { WordDescriptionCard } from './components/WordDescriptionCard';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
// REASON: plasmo need to write "data-text" to import style sheet
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
  return <WordDescriptionCard />;
};

export default PlasmoInline;
