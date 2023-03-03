import "./MediaDisplayLoader.scss";

const MediaDisplayLoader = ({
    mobileDimension,
    desktopDimension,
    isTablet,
}) => {
    const width = isTablet ? mobileDimension?.width : desktopDimension?.width;

    const height = isTablet
        ? mobileDimension?.height
        : desktopDimension?.height;

    const style = {
        width,
        height,
    };

    return <div className='media-display-loader' style={style}></div>;
};

export default MediaDisplayLoader;
