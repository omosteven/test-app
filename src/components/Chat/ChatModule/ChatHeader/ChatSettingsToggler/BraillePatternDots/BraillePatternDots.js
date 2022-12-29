import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";

const BraillePatternDots = ({ isMobile, onClick }) => {
    return (
        <ReactSVG
            src={
                isMobile
                    ? imageLinks?.svg?.verticalGrey
                    : imageLinks?.svg?.horizontalEllipsis
            }
            onClick={onClick}
        />
    );
};

export default BraillePatternDots;
