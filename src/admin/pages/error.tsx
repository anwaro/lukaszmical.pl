import React from 'react';

import Head from 'next/head';

import Button from '../components/Button';
import CardBox from '../components/CardBox';
import SectionFullScreen from '../components/Section/FullScreen';
import {getPageTitle} from '../config';

export const ErrorPage = () => {
    return (
        <>
            <Head>
                <title>{getPageTitle('Error')}</title>
            </Head>

            <SectionFullScreen bg="pinkRed">
                <CardBox
                    className="w-11/12 shadow-2xl md:w-7/12 lg:w-6/12 xl:w-4/12"
                    footer={<Button href="/admin" label="Done" color="danger" />}
                >
                    <div className="space-y-3">
                        <h1 className="text-2xl">Unhandled exception</h1>

                        <p>An Error Occurred</p>
                    </div>
                </CardBox>
            </SectionFullScreen>
        </>
    );
};
