import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
  PlasmoGetStyle
} from 'plasmo';
import { useEffect, useState } from 'react';
import { SummaryCard } from './components/SummaryCard';
import summaryCardStyle from 'data-text:./styles/SummaryCard.scss';
import { useStorage } from '@plasmohq/storage/hook';

/**
 * Plasmo configuration for the content script.
 */
export const config: PlasmoCSConfig = {
  matches: ['https://learn.microsoft.com/*']
};

/**
 * Get the inline anchor for the Plasmo inline.
 */
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  const anchors = document.querySelectorAll('h2.heading-anchor');
  return Array.from(anchors).map((element) => ({
    element,
    insertPosition: 'afterend'
  }));
};

/**
 * Get the styles
 * @returns HTMLStyleElement
 */
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style');
  style.textContent += summaryCardStyle;
  return style;
};

/**
 *
 * @param anchor
 * @returns
 */
const sectionSummary = ({ anchor }) => {
  const [summary, setSummary] = useState('');
  const [isShowSummary] = useStorage<boolean>('isShowSummary');

  useEffect(() => {
    if (!isShowSummary) return;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type !== 'response') return;
      if (message.command !== 'fetchSectionSummary') return;
      setSummary(message.data.sectionSummaries[anchor.element.id]);
    });
  }, [isShowSummary]);

  if (isShowSummary) return <SummaryCard title="段落要約" body={summary} />;
  return null;
};

export default sectionSummary;
