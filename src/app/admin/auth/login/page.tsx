import React from 'react';

import SectionFullScreen from '@/admin/components/Section/FullScreen';
import CardBox from '@/admin/components/CardBox';
import {FormField} from '@/admin/components/form/form-field';
import Divider from '@/admin/components/Divider';
import Buttons from '@/admin/components/Buttons';
import Button from '@/admin/components/Button';

import {login} from './actions';

export default function LoginPage() {
    return (
        <SectionFullScreen bg="purplePink">
            <CardBox className="w-11/12 shadow-2xl md:w-7/12 lg:w-6/12 xl:w-4/12">
                <form>
                    <FormField label="Login" help="Please enter your login">
                        <input name="email" type="email" />
                    </FormField>

                    <FormField label="Password" help="Please enter your password">
                        <input name="password" type="password" />
                    </FormField>

                    <Divider />

                    <Buttons>
                        <Button formAction={login} label="Login" color="info" />
                    </Buttons>
                </form>
            </CardBox>
        </SectionFullScreen>
    );
}
