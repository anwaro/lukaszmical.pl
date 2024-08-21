'use client';

import {mdiAccount, mdiBallotOutline, mdiGithub, mdiMail} from '@mdi/js';
import {Field, Form, Formik} from 'formik';

import {CheckboxField} from '@/admin/components/form/checkbox-field/checkbox-field';
import {CheckboxFieldGroup} from '@/admin/components/form/checkbox-field/checkbox-field-group';
import {FormField} from '@/admin/components/form/form-field/form-field';

import {Button} from '../components/button/button';
import ButtonsGroup from '../components/button/buttons-group';
import Divider from '../components/divider';
import CardBox from '../components/CardBox';
import SectionMain from '../components/Section/Main';
import SectionTitle from '../components/Section/Title';
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton';

export const FormsPage = () => {
    return (
        <>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiBallotOutline}
                    title="Formik forms example"
                    main
                >
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

                <CardBox>
                    <Formik
                        initialValues={{
                            fullname: 'John Doe',
                            email: 'john.doe@example.com',
                            phone: '',
                            color: 'green',
                            textarea: 'Hello',
                        }}
                        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
                    >
                        <Form>
                            <FormField
                                label="Grouped with icons"
                                icons={[mdiAccount, mdiMail]}
                            >
                                <Field name="fullname" placeholder="Full name" />
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                />
                            </FormField>

                            <FormField
                                label="With help line and labelFor"
                                labelFor="phone"
                                help="Help line comes here"
                            >
                                <Field name="phone" placeholder="Phone" id="phone" />
                            </FormField>

                            <FormField label="Dropdown" labelFor="color">
                                <Field name="color" id="color" component="select">
                                    <option value="red">Red</option>
                                    <option value="green">Green</option>
                                    <option value="blue">Blue</option>
                                </Field>
                            </FormField>

                            <Divider />

                            <FormField label="Textarea" hasTextareaHeight>
                                <Field
                                    name="textarea"
                                    as="textarea"
                                    placeholder="Your text here"
                                />
                            </FormField>

                            <Divider />

                            <ButtonsGroup>
                                <Button type="submit" color="info" label="Submit" />
                                <Button
                                    type="reset"
                                    color="info"
                                    outline
                                    label="Reset"
                                />
                            </ButtonsGroup>
                        </Form>
                    </Formik>
                </CardBox>
            </SectionMain>

            <SectionTitle>Custom elements</SectionTitle>

            <SectionMain>
                <CardBox>
                    <Formik
                        initialValues={{
                            checkboxes: ['lorem'],
                            switches: ['lorem'],
                            radio: 'lorem',
                        }}
                        onSubmit={() => {}}
                    >
                        <Form>
                            <FormField label="Checkbox">
                                <CheckboxFieldGroup>
                                    <CheckboxField type="checkbox" label="Lorem">
                                        <Field
                                            type="checkbox"
                                            name="checkboxes"
                                            value="lorem"
                                        />
                                    </CheckboxField>
                                    <CheckboxField type="checkbox" label="Ipsum">
                                        <Field
                                            type="checkbox"
                                            name="checkboxes"
                                            value="ipsum"
                                        />
                                    </CheckboxField>
                                    <CheckboxField type="checkbox" label="Dolore">
                                        <Field
                                            type="checkbox"
                                            name="checkboxes"
                                            value="dolore"
                                        />
                                    </CheckboxField>
                                </CheckboxFieldGroup>
                            </FormField>

                            <Divider />

                            <FormField label="Radio">
                                <CheckboxFieldGroup>
                                    <CheckboxField type="radio" label="Lorem">
                                        <Field
                                            type="radio"
                                            name="radio"
                                            value="lorem"
                                        />
                                    </CheckboxField>
                                    <CheckboxField type="radio" label="Ipsum">
                                        <Field
                                            type="radio"
                                            name="radio"
                                            value="ipsum"
                                        />
                                    </CheckboxField>
                                </CheckboxFieldGroup>
                            </FormField>

                            <Divider />

                            <FormField label="Switch">
                                <CheckboxFieldGroup>
                                    <CheckboxField type="switch" label="Lorem">
                                        <Field
                                            type="checkbox"
                                            name="switches"
                                            value="lorem"
                                        />
                                    </CheckboxField>
                                    <CheckboxField type="switch" label="Ipsum">
                                        <Field
                                            type="checkbox"
                                            name="switches"
                                            value="ipsum"
                                        />
                                    </CheckboxField>
                                </CheckboxFieldGroup>
                            </FormField>
                        </Form>
                    </Formik>
                    <Divider />
                </CardBox>
            </SectionMain>
        </>
    );
};
