const IframeView = ({ isLoading, isLoaded, src, title }) => {
    return (
        <>
            <iframe
                src={src}
                width='100%'
                height={isLoading ? "0%" : "100%"}
                frameBorder='0'
                title={title}
                onLoad={() => {
                    isLoaded.current = true;
                }}
                sandbox='allow-orientation-lock allow-pointer-lock allow-popups	allow-popups-to-escape-sandbox	allow-presentation	allow-same-origin	allow-scripts	allow-top-navigation allow-top-navigation-by-user-activation'></iframe>
        </>
    );
};
export default IframeView;
