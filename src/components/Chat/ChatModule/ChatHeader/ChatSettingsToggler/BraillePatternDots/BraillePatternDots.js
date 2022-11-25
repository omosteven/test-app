import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";

const BraillePatternDots = ({ isMobile }) => {
    return (
        <ReactSVG
            src={
                isMobile
                    ? imageLinks?.svg?.verticalGrey
                    : imageLinks?.svg?.horizontalEllipsis
            }
        />
    );
};

export default BraillePatternDots;
