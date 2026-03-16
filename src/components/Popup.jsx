import './Popup.css';

export function Popup({ title, message, buttonText, onButtonClick, type, changeLangFonction, langLabelText, langContext }) {
    return (
        <div className="popup">
            <div className={`popup-content ${type}`}> {/* ${type} sert à définir le style du popup en fonction de son type (victoire, défaite, etc.) */}
                
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onButtonClick}>{buttonText}</button>

                <div className="lang-container">
                    <span className="lang-text">{langContext}</span>
                    <button className="lang-btn" onClick={changeLangFonction}>{langLabelText}</button>
                </div>

            </div>
        </div>
    );
}