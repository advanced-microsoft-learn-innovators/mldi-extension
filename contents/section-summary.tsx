import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList,
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
  const [abstract, setAbstract] = useState('');

  useEffect(() => {
    setAbstract(
      anchor.element.id +
        `: これが${anchor.element.innerText}の要約内容です。できれば 100 字以内で収めたいところ。ああああああああ Teams あああああああああああああああああああああ`
    );
  }, []);

  return <SummaryCard title="段落要約" body={abstract} />;
};

export default sectionSummary;
