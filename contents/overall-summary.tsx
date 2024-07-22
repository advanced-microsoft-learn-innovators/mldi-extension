import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetStyle
} from 'plasmo';
import { useEffect, useState } from 'react';
import { SummaryCard } from './components/SummaryCard';
import summaryCardStyle from 'data-text:./styles/SummaryCard.scss';

/**
 * Plasmo configuration for the content script.
 */
export const config: PlasmoCSConfig = {
  matches: ['https://learn.microsoft.com/*']
};

/**
 * Get the inline anchor for the Plasmo inline.
 */
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.getElementById('center-doc-outline'),
  position: 'afterend'
});

/**
 * Get the styles
 * @returns HTMLStyleElement
 */
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style');
  style.textContent += summaryCardStyle;
  return style;
};

const overallSummary = () => {
  const [abstract, setAbstract] = useState('');

  useEffect(() => {
    (async () => {
      const response = await chrome.runtime.sendMessage({
        type: 'api',
        command: 'fetchSummary',
        data: { url: window.location.href }
      });
      setAbstract(response.summary);
    })();
  }, []);

  return <SummaryCard title="要約" body={abstract} />;
};

export default overallSummary;
