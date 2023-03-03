import "./MediaDisplayLoader.scss";

const MediaDisplayLoader = ({
    desktopDimension,
    isTablet,
}) => {
    const width = isTablet ? "340px" : desktopDimension?.width;

    const height = isTablet ? "200px" : desktopDimension?.height;

    const style = {
        width,
        height,
    };

    return <div className='media-display-loader' style={style}></div>;
};

export default MediaDisplayLoader;
