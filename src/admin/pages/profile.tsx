'use client';
import type {UserForm} from '../interfaces';

import {
    mdiAccount,
    mdiAsterisk,
    mdiFormTextboxPassword,
    mdiGithub,
    mdiMail,
    mdiUpload,
} from '@mdi/js';
import {Field, Form, Formik} from 'formik';
import Head from 'next/head';

import {FormField} from '@/admin/components/form/form-field';
import FormFilePicker from '@/admin/components/form/FilePicker';

import Button from '../components/Button';
import Buttons from '../components/Buttons';
import Divider from '../components/Divider';
import CardBox from '../components/CardBox';
import CardBoxComponentBody from '../components/CardBox/Component/Body';
import CardBoxComponentFooter from '../components/CardBox/Component/Footer';
import SectionMain from '../components/Section/Main';
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton';
import CardBoxUser from '../components/CardBox/User';
import {getPageTitle} from '../config';

export const ProfilePage = () => {
    const userName = 'lukasz M';
    const userEmail = 'lukasz.mical11@gmail.com';

    const userForm: UserForm = {
        name: userName,
        email: userEmail,
    };

    return (
        <>
            <Head>
                <title>{getPageTitle('Profile')}</title>
            </Head>

            <SectionMain>
                <SectionTitleLineWithButton icon={mdiAccount} title="Profile" main>
                    <Button
                        href="https://github.com/justboil/admin-one-react-tailwind"
                        target="_blank"
                        icon={mdiGithub}
                        label="Star on GitHub"
                        color="contrast"
                        roundedFull
                        small
                    />
                </SectionTitleLineWithButton>

                <CardBoxUser className="mb-6" />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="flex flex-col">
                        <CardBox className="mb-6">
                            <FormField label="Avatar" help="Max 500kb">
                                <FormFilePicker
                                    label="Upload"
                                    color="info"
                                    icon={mdiUpload}
                                />
                            </FormField>
                        </CardBox>

                        <CardBox className="flex-1" hasComponentLayout>
                            <Formik
                                initialValues={userForm}
                                onSubmit={(values: UserForm) =>
                                    alert(JSON.stringify(values, null, 2))
                                }
                            >
                                <Form className="flex flex-1 flex-col">
                                    <CardBoxComponentBody>
                                        <FormField
                                            label="Name"
                                            help="Required. Your name"
                                            labelFor="name"
                                            icons={[mdiAccount]}
                                        >
                                            <Field
                                                name="name"
                                                id="name"
                                                placeholder="Name"
                                            />
                                        </FormField>
                                        <FormField
                                            label="E-mail"
                                            help="Required. Your e-mail"
                                            labelFor="email"
                                            icons={[mdiMail]}
                                        >
                                            <Field
                                                name="email"
                                                id="email"
                                                placeholder="E-mail"
                                            />
                                        </FormField>
                                    </CardBoxComponentBody>
                                    <CardBoxComponentFooter>
                                        <Buttons>
                                            <Button
                                                color="info"
                                                type="submit"
                                                label="Submit"
                                            />
                                            <Button
                                                color="info"
                                                label="Options"
                                                outline
                                            />
                                        </Buttons>
                                    </CardBoxComponentFooter>
                                </Form>
                            </Formik>
                        </CardBox>
                    </div>

                    <CardBox hasComponentLayout>
                        <Formik
                            initialValues={{
                                currentPassword: '',
                                newPassword: '',
                                newPasswordConfirmation: '',
                            }}
                            onSubmit={(values) =>
                                alert(JSON.stringify(values, null, 2))
                            }
                        >
                            <Form className="flex flex-1 flex-col">
                                <CardBoxComponentBody>
                                    <FormField
                                        label="Current password"
                                        help="Required. Your current password"
                                        labelFor="currentPassword"
                                        icons={[mdiAsterisk]}
                                    >
                                        <Field
                                            name="currentPassword"
                                            id="currentPassword"
                                            type="password"
                                            autoComplete="current-password"
                                        />
                                    </FormField>

                                    <Divider />

                                    <FormField
                                        label="New password"
                                        help="Required. New password"
                                        labelFor="newPassword"
                                        icons={[mdiFormTextboxPassword]}
                                    >
                                        <Field
                                            name="newPassword"
                                            id="newPassword"
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Confirm password"
                                        help="Required. New password one more time"
                                        labelFor="newPasswordConfirmation"
                                        icons={[mdiFormTextboxPassword]}
                                    >
                                        <Field
                                            name="newPasswordConfirmation"
                                            id="newPasswordConfirmation"
                                            type="password"
                                            autoComplete="new-password"
                                        />
                                    </FormField>
                                </CardBoxComponentBody>

                                <CardBoxComponentFooter>
                                    <Buttons>
                                        <Button
                                            color="info"
                                            type="submit"
                                            label="Submit"
                                        />
                                        <Button
                                            color="info"
                                            label="Options"
                                            outline
                                        />
                                    </Buttons>
                                </CardBoxComponentFooter>
                            </Form>
                        </Formik>
                    </CardBox>
                </div>
            </SectionMain>
        </>
    );
};
