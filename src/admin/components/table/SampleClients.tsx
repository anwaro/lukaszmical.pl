'use client';

import React, {useState} from 'react';

import {mdiEye, mdiTrashCan} from '@mdi/js';

import {useSampleClients} from '../../hooks/sampleData';
import {Client} from '../../interfaces';
import Button from '../Button';
import Buttons from '../Buttons';
import UserAvatar from '../UserAvatar';

const TableSampleClients = () => {
    const {clients} = useSampleClients();

    const perPage = 5;

    const [currentPage, setCurrentPage] = useState(0);

    const clientsPaginated = clients.slice(
        perPage * currentPage,
        perPage * (currentPage + 1),
    );

    const numPages = clients.length / perPage;

    const pagesList = [];

    for (let i = 0; i < numPages; i++) {
        pagesList.push(i);
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th />
                        <th>Name</th>
                        <th>Company</th>
                        <th>City</th>
                        <th>Progress</th>
                        <th>Created</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {clientsPaginated.map((client: Client) => (
                        <tr key={client.id}>
                            <td className="border-b-0 before:hidden lg:w-6">
                                <UserAvatar
                                    username={client.name}
                                    className="mx-auto size-24 lg:size-6"
                                />
                            </td>
                            <td data-label="Name">{client.name}</td>
                            <td data-label="Company">{client.company}</td>
                            <td data-label="City">{client.city}</td>
                            <td data-label="Progress" className="lg:w-32">
                                <progress
                                    className="flex w-2/5 self-center lg:w-full"
                                    max="100"
                                    value={client.progress}
                                >
                                    {client.progress}
                                </progress>
                            </td>
                            <td
                                data-label="Created"
                                className="whitespace-nowrap lg:w-1"
                            >
                                <small className="text-gray-500 dark:text-slate-400">
                                    {client.created}
                                </small>
                            </td>
                            <td className="whitespace-nowrap before:hidden lg:w-1">
                                <Buttons type="justify-start lg:justify-end" noWrap>
                                    <Button color="info" icon={mdiEye} small />
                                    <Button
                                        color="danger"
                                        icon={mdiTrashCan}
                                        small
                                    />
                                </Buttons>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
                <div className="flex flex-col items-center justify-between py-3 md:flex-row md:py-0">
                    <Buttons>
                        {pagesList.map((page) => (
                            <Button
                                key={page}
                                active={page === currentPage}
                                label={page + 1}
                                color={
                                    page === currentPage ? 'lightDark' : 'whiteDark'
                                }
                                small
                                onClick={() => setCurrentPage(page)}
                            />
                        ))}
                    </Buttons>
                    <small className="mt-6 md:mt-0">
                        Page {currentPage + 1} of {numPages}
                    </small>
                </div>
            </div>
        </>
    );
};

export default TableSampleClients;
