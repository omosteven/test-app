import React from "react";
import { ReactSVG } from "react-svg";
import imageLinks from "assets/images";
import { Button } from "components/ui";

const NewTicketButton = ({
    handleClick,
    otherClassNames,
    loading,
    openNewTicket,
}) => {
    return (
        <>
            {(!loading || openNewTicket) && (
                <Button
                    icon={
                        <ReactSVG src={imageLinks.svg.add} className='icon' />
                    }
                    text='New conversation'
                    otherClass={`new__convo ${
                        otherClassNames ? otherClassNames : ""
                    }`}
                    onClick={handleClick}
                    loading={openNewTicket}
                />
            )}
        </>
    );
};

export default NewTicketButton;
