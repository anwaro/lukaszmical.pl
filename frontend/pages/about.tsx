import React from 'react';

import Layout from '~components/Layout/Layout';
import PersonBackground from '~components/Pages/Homepage/PersonBackground';

const About = () => (
    <Layout seo={{title: 'Łukasz Micał | About'}}>
        <PersonBackground />
    </Layout>
);

export default About;
