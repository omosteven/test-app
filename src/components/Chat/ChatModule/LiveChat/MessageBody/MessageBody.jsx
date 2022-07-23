import React, { useEffect } from "react";
import SmothScrollContent from "../../../../ui/SmothScrollContent/SmothScrollContent";
import Messages from "./Messages/Messages";
import $ from 'jquery';
import 'malihu-custom-scrollbar-plugin';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
require('jquery-mousewheel');

const MessageBody = ({ messages, ticketId, agent, forcedAgentTyping, handleMessageOptionSelect,handleOptConversation }) => {
    const ID = 'messageBody';
    const _autoScroll = () => {
        try {
            console.log('please auto scroll here')
            // // $(`#${ID}`).mCustomScrollbar("scrollTo", 'bottom', {     scrollEasing:"easeOut"        });
            // $(`#${ID}`)[0].scrollIntoView({
            //     behavior: "smooth", // or "auto" or "instant"
            //     // block: "en" // or "end"
            // });
            $(`#${ID}`).scrollTop($(`#${ID}`)[0].scrollHeight);

            // var objDiv = document.getElementById("your_div");
            // objDiv.scrollTop = objDiv.scrollHeight;
            
            // console.log($('#dummy'));
        } catch (err) {
            console.log('error scrolling')
        }
    }

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

    useEffect(() => (smoothScrollEffect()))

    return (
        <div className='message-body' id={ID}>
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
