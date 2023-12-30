import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../design/custom.css';
import {Divider} from '../common/divider';

export const Home = () => {

    const latestsNews = ["Create articles in multiple languages!", "Set-up a costume image for each article by language", "Upload any kind of files"];
    const relevantInfo = ["Open-source project", "Supports Azure Active Directory", "Powered by serverless Azure Functions"];

    return (
        <div>
            <div className='text-center'>
                <h1>Harck-CMS</h1>
            </div>
            <Divider title='Latests news 🔥' />
            <div className='text-center text-margins'>
                <p><strong>Available features on the Harck-CMS v.1.0.0</strong></p>
                {
                    latestsNews.map((news, index) => {
                        return <p key={index}>
                            ▹ {news}
                        </p>
                    })
                }

                <br />
                <p><strong>Other relevant information:</strong></p>
                {
                    relevantInfo.map((info, index) => {
                        return <p key={index}>
                            ▹ {info}
                        </p>
                    })
                }
            </div>
        </div>
    );
}