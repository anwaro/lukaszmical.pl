import type {ReactElement} from 'react';
import React from 'react';
import Button from '../components/Button';
import CardBox from '../components/CardBox';
import SectionFullScreen from '../components/Section/FullScreen';
import LayoutGuest from '../layouts/Guest';
import FormField from '../components/Form/Field';
import Divider from '../components/Divider';
import Buttons from '../components/Buttons';

export const LoginPage = () => {
    return (
        <SectionFullScreen bg="purplePink">
            <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl">
                <form>
                    <FormField label="Login" help="Please enter your login">
                        <input name="email" type="email" />
                    </FormField>

                    <FormField label="Password" help="Please enter your password">
                        <input name="password" type="password" />
                    </FormField>

                    <Divider />

                    <Buttons>
                        <Button type="submit" label="Login" color="info" />
                    </Buttons>
                </form>
            </CardBox>
        </SectionFullScreen>
    );
};
