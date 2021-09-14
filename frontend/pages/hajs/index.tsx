import React, {useState} from 'react';

import Index from '../../src/components/Layout/Layout';

const Hajs = () => {
    const [projects, setProjects] = useState<Array<{id: number}>>([]);

    const addProject = () => {
        setProjects([...projects, {id: Math.random()}]);
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
