import React from 'react';

import {BannerEntity} from '~types/BannerEntity';
import {apiFileUrl} from '~utils/fileUrl';

export type BannerProps = {
    section: BannerEntity;
};

const Banner: React.FC<BannerProps> = ({
    section: {text, image, mobileImage, url},
}) => {
    return (
        <section>
            {url && <a href={url}>{url}</a>}
            <span>{text}</span>
            {image && <img src={apiFileUrl(image.url)} alt={''} />}
            {mobileImage && <img src={apiFileUrl(mobileImage.url)} alt={''} />}
        </section>
    );
};

export default Banner;
