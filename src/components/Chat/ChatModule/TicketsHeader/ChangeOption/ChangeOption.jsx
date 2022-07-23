import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../../../../../lib/api';
import apiRoutes from '../../../../../lib/api/apiRoutes';
import { dataQueryStatus } from '../../../../../utils/formatHandlers';
import { getErrorMessage } from '../../../../../utils/helper';
import { Button } from '../../../../ui';

const { LOADING } = dataQueryStatus;
const ChangeOption = ({ ticketId, setStatus, setErrorMssg, requestAllMessages }) => {
    const [loading, setLoading] = useState(false);
    const { chatSettings: { chatThemeColor }} = useSelector(state => state.chat)

    const changeLastBranchOptionChoice = async () => {
        try {
            setLoading(true)
            setStatus(LOADING);
            setErrorMssg();

            const url = apiRoutes?.changeTicketChoice(ticketId);
            const res = await API.post(url);
            if (res.status === 201) {
                requestAllMessages()
                setLoading(false)
            }

        } catch (err) {
            setLoading(false)
            setStatus(dataQueryStatus?.ERROR);
            setErrorMssg(getErrorMessage(err));
        }
    }

    // chatThemeColor
    return (

        <div>
            <Button 
                text={'Change Choice'}
                classType={'change-choice'}
                onClick={changeLastBranchOptionChoice}
                disabled={loading}
                style={{
                    color: chatThemeColor,
                    background: `${chatThemeColor}21`
                }}
             />
        </div>
    );
};

export default ChangeOption;