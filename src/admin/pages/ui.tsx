'use client';
import {useState} from 'react';

import {
    mdiAlert,
    mdiAlertCircle,
    mdiCheckCircle,
    mdiClose,
    mdiContrastCircle,
    mdiInformation,
    mdiOpenInNew,
    mdiReload,
    mdiTrendingUp,
} from '@mdi/js';
import {Field, Formik} from 'formik';

import {CheckboxField} from '@/admin/components/form/checkbox-field/checkbox-field';
import {CheckboxFieldGroup} from '@/admin/components/form/checkbox-field/checkbox-field-group';

import {Button} from '../components/button/button';
import ButtonsGroup from '../components/button/buttons-group';
import Divider from '../components/divider';
import CardBox from '../components/CardBox';
import CardBoxComponentEmpty from '../components/CardBox/Component/Empty';
import CardBoxComponentTitle from '../components/CardBox/Component/Title';
import CardBoxModal from '../components/CardBox/Modal';
import NotificationBar from '../components/NotificationBar';
import PillTag from '../components/PillTag';
import SectionMain from '../components/Section/Main';
import SectionTitle from '../components/Section/Title';
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton';
import {getPageTitle} from '../config';

export const UiPage = () => {
    const CardSamplesFooter = (
        <ButtonsGroup>
            <Button label="Confirm" color="info" />
            <Button label="Cancel" color="info" outline />
        </ButtonsGroup>
    );

    const modalSampleCardClassName =
        'cursor-pointer md:w-7/12 lg:w-5/12 shadow-2xl md:mx-auto';

    const modalSampleContents = (
        <>
            <p>
                Lorem ipsum dolor sit amet <b>adipiscing elit</b>
            </p>
            <p>This is sample modal</p>
        </>
    );

    const modalFooterInfo = (
        <ButtonsGroup>
            <Button label="Confirm" color="info" />
            <Button label="Cancel" color="info" outline />
        </ButtonsGroup>
    );

    const modalFooterDanger = (
        <ButtonsGroup>
            <Button label="Done" color="danger" />
        </ButtonsGroup>
    );

    const modalFooterSuccess = (
        <ButtonsGroup>
            <Button label="Done" color="success" />
        </ButtonsGroup>
    );

    const handleModalAction = () => {
        setIsModalInfoActive(false);
        setIsModalDangerActive(false);
        setIsModalSuccessActive(false);
    };

    const [isModalInfoActive, setIsModalInfoActive] = useState(false);
    const [isModalDangerActive, setIsModalDangerActive] = useState(false);
    const [isModalSuccessActive, setIsModalSuccessActive] = useState(false);

    return (
        <>
            <SectionTitle first>Dark mode</SectionTitle>

            <SectionMain>
                <CardBox className="shadow-2xl md:mx-auto md:w-7/12 lg:w-5/12 xl:w-4/12">
                    <div className="py-24 text-center text-slate-400 lg:py-12">
                        <Button label="Toggle" color="contrast" onClick={() => {}} />
                    </div>
                </CardBox>
            </SectionMain>

            <SectionTitle>Modal examples</SectionTitle>

            <CardBoxModal
                title="Please confirm action"
                buttonColor="info"
                buttonLabel="Confirm"
                isActive={isModalInfoActive}
                onConfirm={handleModalAction}
                onCancel={handleModalAction}
            >
                {modalSampleContents}
            </CardBoxModal>

            <CardBoxModal
                title="Unhandled exception"
                buttonColor="danger"
                buttonLabel="Done"
                isActive={isModalDangerActive}
                onConfirm={handleModalAction}
            >
                {modalSampleContents}
            </CardBoxModal>

            <CardBoxModal
                title="Success"
                buttonColor="success"
                buttonLabel="Done"
                isActive={isModalSuccessActive}
                onConfirm={handleModalAction}
            >
                {modalSampleContents}
            </CardBoxModal>

            <SectionMain>
                <div className="space-y-12">
                    <CardBox
                        className={modalSampleCardClassName}
                        footer={modalFooterInfo}
                        onClick={() => setIsModalInfoActive(true)}
                        isHoverable
                    >
                        <CardBoxComponentTitle title="Please confirm action">
                            <Button
                                icon={mdiClose}
                                color="whiteDark"
                                small
                                roundedFull
                            />
                        </CardBoxComponentTitle>
                        <div className="space-y-3">
                            <p>Click to see in action</p>
                        </div>
                    </CardBox>

                    <CardBox
                        className={modalSampleCardClassName}
                        footer={modalFooterDanger}
                        onClick={() => setIsModalDangerActive(true)}
                        isHoverable
                    >
                        <CardBoxComponentTitle title="Unhandled exception" />

                        <div className="space-y-3">
                            <p>Click to see in action</p>
                        </div>
                    </CardBox>

                    <CardBox
                        className={modalSampleCardClassName}
                        footer={modalFooterSuccess}
                        onClick={() => setIsModalSuccessActive(true)}
                        isHoverable
                    >
                        <CardBoxComponentTitle title="Success" />

                        <div className="space-y-3">
                            <p>Click to see in action</p>
                        </div>
                    </CardBox>
                </div>
            </SectionMain>

            <Formik initialValues={{outline: false}} onSubmit={() => {}}>
                {({values}) => (
                    <>
                        <SectionTitle custom>
                            <h1 className="text-2xl text-slate-400">
                                Notifications
                            </h1>
                            <div className="mt-6 flex items-center justify-center">
                                <CheckboxField type="switch" label="Outline">
                                    <Field type="checkbox" name="outline" />
                                </CheckboxField>
                            </div>
                        </SectionTitle>

                        <SectionMain>
                            <NotificationBar
                                color="info"
                                icon={mdiInformation}
                                button={
                                    <Button
                                        color={values.outline ? 'info' : 'white'}
                                        label="Button"
                                        roundedFull
                                        small
                                        outline={values.outline}
                                    />
                                }
                                outline={values.outline}
                            >
                                <b>Info state</b>. NotificationBar
                            </NotificationBar>

                            <NotificationBar
                                color="success"
                                icon={mdiCheckCircle}
                                button={
                                    <Button
                                        color={values.outline ? 'success' : 'white'}
                                        label="Button"
                                        roundedFull
                                        small
                                        outline={values.outline}
                                    />
                                }
                                outline={values.outline}
                            >
                                <b>Success state</b>. NotificationBar
                            </NotificationBar>

                            <NotificationBar
                                color="warning"
                                icon={mdiAlert}
                                button={
                                    <Button
                                        color={values.outline ? 'warning' : 'white'}
                                        label="Button"
                                        roundedFull
                                        small
                                        outline={values.outline}
                                    />
                                }
                                outline={values.outline}
                            >
                                <b>Warning state</b>. NotificationBar
                            </NotificationBar>

                            <NotificationBar
                                color="danger"
                                icon={mdiAlertCircle}
                                button={
                                    <Button
                                        color={values.outline ? 'danger' : 'white'}
                                        label="Button"
                                        roundedFull
                                        small
                                        outline={values.outline}
                                    />
                                }
                                outline={values.outline}
                            >
                                <b>Danger state</b>. NotificationBar
                            </NotificationBar>

                            <NotificationBar
                                color="contrast"
                                icon={mdiContrastCircle}
                                outline={values.outline}
                            >
                                <b>Contrast</b>. NotificationBar
                            </NotificationBar>
                        </SectionMain>
                    </>
                )}
            </Formik>

            <SectionTitle>Buttons</SectionTitle>

            <SectionMain>
                <CardBox>
                    <Formik
                        initialValues={{
                            outline: false,
                            small: false,
                            rounded: false,
                            disabled: false,
                        }}
                        onSubmit={() => {}}
                    >
                        {({values}) => (
                            <>
                                <CheckboxFieldGroup>
                                    <CheckboxField type="switch" label="Outline">
                                        <Field type="checkbox" name="outline" />
                                    </CheckboxField>
                                    <CheckboxField type="switch" label="Small">
                                        <Field type="checkbox" name="small" />
                                    </CheckboxField>
                                    <CheckboxField type="switch" label="Rounded">
                                        <Field type="checkbox" name="rounded" />
                                    </CheckboxField>
                                    <CheckboxField type="switch" label="Disabled">
                                        <Field type="checkbox" name="disabled" />
                                    </CheckboxField>
                                </CheckboxFieldGroup>

                                <Divider />

                                <ButtonsGroup>
                                    <Button
                                        color="lightDark"
                                        label="Button"
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="contrast"
                                        label="Button"
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="info"
                                        label="Button"
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="success"
                                        label="Button"
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="warning"
                                        label="Button"
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="danger"
                                        label="Button"
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                </ButtonsGroup>

                                <Divider />

                                <ButtonsGroup>
                                    <Button
                                        color="lightDark"
                                        label="Button"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="contrast"
                                        label="Button"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="info"
                                        label="Button"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="success"
                                        label="Button"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="warning"
                                        label="Button"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="danger"
                                        label="Button"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                </ButtonsGroup>

                                <Divider />

                                <ButtonsGroup>
                                    <Button
                                        color="lightDark"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="contrast"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="info"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="success"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="warning"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                    <Button
                                        color="danger"
                                        icon={mdiOpenInNew}
                                        outline={values.outline}
                                        small={values.small}
                                        roundedFull={values.rounded}
                                        disabled={values.disabled}
                                    />
                                </ButtonsGroup>
                            </>
                        )}
                    </Formik>
                </CardBox>
            </SectionMain>

            <SectionTitle>Pills</SectionTitle>

            <SectionMain>
                <CardBox>
                    <Formik
                        initialValues={{outline: false, small: false, icon: true}}
                        onSubmit={() => {}}
                    >
                        {({values}) => (
                            <>
                                <CheckboxFieldGroup>
                                    <CheckboxField type="switch" label="Outline">
                                        <Field type="checkbox" name="outline" />
                                    </CheckboxField>
                                    <CheckboxField type="switch" label="Small">
                                        <Field type="checkbox" name="small" />
                                    </CheckboxField>
                                    <CheckboxField type="switch" label="Icon">
                                        <Field type="checkbox" name="icon" />
                                    </CheckboxField>
                                </CheckboxFieldGroup>
                                <Divider />
                                <ButtonsGroup>
                                    <PillTag
                                        color="contrast"
                                        label="Contrast"
                                        icon={
                                            values.icon ? mdiTrendingUp : undefined
                                        }
                                        outline={values.outline}
                                        small={values.small}
                                    />
                                    <PillTag
                                        color="info"
                                        label="Info"
                                        icon={
                                            values.icon ? mdiTrendingUp : undefined
                                        }
                                        outline={values.outline}
                                        small={values.small}
                                    />
                                    <PillTag
                                        color="success"
                                        label="Info"
                                        icon={
                                            values.icon ? mdiTrendingUp : undefined
                                        }
                                        outline={values.outline}
                                        small={values.small}
                                    />
                                    <PillTag
                                        color="warning"
                                        label="Info"
                                        icon={
                                            values.icon ? mdiTrendingUp : undefined
                                        }
                                        outline={values.outline}
                                        small={values.small}
                                    />
                                    <PillTag
                                        color="danger"
                                        label="Info"
                                        icon={
                                            values.icon ? mdiTrendingUp : undefined
                                        }
                                        outline={values.outline}
                                        small={values.small}
                                    />
                                </ButtonsGroup>
                            </>
                        )}
                    </Formik>
                </CardBox>
            </SectionMain>

            <SectionTitle>Cards</SectionTitle>

            <SectionMain>
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <CardBox footer={CardSamplesFooter}>
                        <CardBoxComponentTitle title="With title & icon">
                            <Button icon={mdiReload} color="whiteDark" roundedFull />
                        </CardBoxComponentTitle>
                        <div className="space-y-3">
                            <p>Card with title, icon & footer</p>
                        </div>
                    </CardBox>

                    <CardBox footer={CardSamplesFooter}>Just body & footer</CardBox>
                </div>

                <SectionTitleLineWithButton
                    icon={mdiAlertCircle}
                    title="Empty variation"
                />

                <CardBox>
                    <CardBoxComponentEmpty />
                </CardBox>
            </SectionMain>
        </>
    );
};
