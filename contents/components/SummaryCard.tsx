import aoaiIcon from 'data-base64:~assets/aoai_icon.svg';

export const SummaryCard = ({
  title,
  body
}: {
  title: string;
  body: string;
}) => {
  return (
    <div className="mldi_card_base">
      <div className="card_title">
        <img className="card_title_icon" src={aoaiIcon} alt="AOAI" />
        <div className="card_title_text">{title}</div>
      </div>
      {body !== '' ? (
        <div className="card_body">{body}</div>
      ) : (
        <div className="card_loading" />
      )}
    </div>
  );
};
