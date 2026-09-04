import React from 'react';

import SectionFullScreen from '@/admin/components/Section/FullScreen';
import CardBox from '@/admin/components/CardBox';
import {FormField} from '@/admin/components/form/form-field/form-field';
import Divider from '@/admin/components/divider';
import ButtonsGroup from '@/admin/components/button/buttons-group';
import {Button} from '@/admin/components/button/button';

import {login} from './actions';

type Props = {
    searchParams: Promise<{error?: string}>;
};

export default async function LoginPage({searchParams}: Props) {
    const {error} = await searchParams;

    return (
        <SectionFullScreen>
            <CardBox className="w-11/12 shadow-2xl md:w-7/12 lg:w-6/12 xl:w-4/12">
                <form>
                    <FormField label="Password" help="Please enter your password">
                        <input name="password" type="password" />
                    </FormField>

                    {error && (
                        <p className="text-red-500">Invalid password</p>
                    )}

                    <Divider />

                    <ButtonsGroup>
                        <Button formAction={login} label="Login" color="info" />
                    </ButtonsGroup>
                </form>
            </CardBox>
        </SectionFullScreen>
    );
}
