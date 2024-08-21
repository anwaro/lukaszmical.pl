import {useActionState, useCallback} from 'react';

import {uploadImage} from '@/admin/actions/upload-image';

export function useImageField() {
    const [state, formAction, isPending] = useActionState(uploadImage, {
        url: '',
    });

    const upload = useCallback((image: File) => {
        const form = new FormData();
        form.append('file', image, image.name);
        formAction(form);
    }, []);

    return {...state, isPending, upload};
}
