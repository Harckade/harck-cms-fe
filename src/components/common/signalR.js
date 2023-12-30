import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { storeSignalRConnection, receivedSignalRMessage } from '../../actions/settings';
import * as Url from '../../consts/urls/settings';
import * as signalR from '@microsoft/signalr'
import { apiRequest } from '../../consts/initialization/authConfig';

export const SignalR = ({instance, accounts}) => {
    const dispatch = useDispatch();

    const getJwtToken = async () => {
        const request = {
            ...apiRequest,
            account: accounts[0]
        };
        return await instance.acquireTokenSilent(request).then((response) => response.accessToken)
            .catch(async (e) => {
                return await instance.acquireTokenPopup(request).then((response) => response.accessToken)
            });
    }

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(Url.NOTIFICATIONS_URL(), {
                accessTokenFactory: async () => {
                    let token = await getJwtToken();
                    return Promise.resolve(token);
                },
                headers: {
                    Authorization: `Bearer ${getJwtToken()}`
                }
            }).withAutomaticReconnect({
                nextRetryDelayInMilliseconds: retryContext => {
                    return 5000; // 5 seconds
                },
                // Event handler for the "reconnecting" event
                reconnecting: async reconnectingContext => {
                    let token = await getJwtToken();
                    connection.headers = {
                        Authorization: `Bearer ${token}`
                    };
                }
            })
            .build();

        connection.start().then(() => {
            dispatch(storeSignalRConnection(connection));
        }).catch(console.error);

        connection.on('newMessage', (message) => {
            if (connection.connectionId !== message.connectionId) {
                dispatch(receivedSignalRMessage(message));
            }
        });

        return () => {
            connection.off('newMessage');
            connection.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <></>
};