import React, {useEffect, useState} from 'react';

import Index from '../../components/Layout/Layout';
import {firestore} from '../../config/Firebase.config';

const Hajs = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        firestore.collection('projects').onSnapshot((querySnapshot) => {
            const list: any[] = [];
            querySnapshot.forEach((doc) => {
                const {slug, name} = doc.data();
                list.push({
                    id: doc.id,
                    slug,
                    name,
                });
            });
            setProjects(list);
            console.log(list);
        });
    }, []);

    const addProject = () => {
        firestore
            .collection('projects')
            .add({name: Math.random(), slug: 'setAsyncCallStackDepth'});
    };

    return (
        <Index>
            <div>Projects</div>
            <div>
                <button onClick={addProject}>Add project</button>
                {projects.map((p) => (
                    <div key={p.id}>
                        <code>{JSON.stringify(p, null, 4)}</code>
                    </div>
                ))}
            </div>
        </Index>
    );
};

export default Hajs;
