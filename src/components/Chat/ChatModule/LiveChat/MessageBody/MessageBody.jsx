import React, { useCallback, useEffect } from "react";
import Messages from "./Messages/Messages";
import $ from 'jquery';
import 'malihu-custom-scrollbar-plugin';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import MessageDemo from "../MessageDemo/MessageDemo";
import { useSelector } from "react-redux";
// import MessageDemo from "../MessageDemo/MessageDemo";
require('jquery-mousewheel');

const MessageBody = ({ forcedAgentTyping, handleMessageOptionSelect, handleOptConversation }) => {

    const { activeTicket: ticket, ticketsMessages: messages } = useSelector(state => state.tickets)
    const { ticketId, agent } = ticket;

    const ID = 'messageBody';
    const _autoScroll = useCallback(() => {
        try {
            console.log('please auto scroll here')
            // // $(`#${ID}`).mCustomScrollbar("scrollTo", 'bottom', {     scrollEasing:"easeOut"        });
            // $(`#${ID}`)[0].scrollIntoView({
            //     behavior: "smooth", // or "auto" or "instant"
            //     // block: "en" // or "end"
            // });
            // $(`#${ID}`).scrollTop($(`#${ID}`)[0].scrollHeight);
            document.getElementById('dummy').scrollIntoView({ behavior: 'smooth', block: 'end' });
            // var objDiv = document.getElementById("your_div");
            // objDiv.scrollTop = objDiv.scrollHeight;

            // console.log($('#dummy'));
        } catch (err) {
            console.log('error scrolling')
        }
    }, [])

    const smoothScrollEffect = () => {
        $(`#${ID}`).mCustomScrollbar({
            theme: "minimal-dark",
            callbacks: {//
                onInit: function () {
                    setTimeout(function () {
                        _autoScroll()
                    }, 1000);
                }
            }
        });
    }

    // useEffect(() => (smoothScrollEffect()))
    useEffect(() => {
        _autoScroll()
    }, [messages])

    return (
        <div className='message-body scroll' id={ID}>
            <Messages
                messages={messages}
                agent={agent}
                ticketId={ticketId}
                forcedAgentTyping={forcedAgentTyping}
                handleMessageOptionSelect={handleMessageOptionSelect}
                handleOptConversation={handleOptConversation}
            />
        </div>
    );
};

export default React.memo(MessageBody);

// export default MessageBody;
