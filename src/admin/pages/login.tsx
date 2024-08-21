import React from 'react';

import {FormField} from '@/admin/components/form/form-field/form-field';

import {Button} from '../components/button/button';
import CardBox from '../components/CardBox';
import SectionFullScreen from '../components/Section/FullScreen';
import Divider from '../components/divider';
import ButtonsGroup from '../components/button/buttons-group';

export const LoginPage = () => {
    return (
        <SectionFullScreen>
            <CardBox className="w-11/12 shadow-2xl md:w-7/12 lg:w-6/12 xl:w-4/12">
                <form>
                    <FormField label="Login" help="Please enter your login">
                        <input name="email" type="email" />
                    </FormField>

                    <FormField label="Password" help="Please enter your password">
                        <input name="password" type="password" />
                    </FormField>

                    <Divider />

                    <ButtonsGroup>
                        <Button type="submit" label="Login" color="info" />
                    </ButtonsGroup>
                </form>
            </CardBox>
        </SectionFullScreen>
    );
};
