import React, {ReactNode} from 'react';
import UserAvatar from '.';

type Props = {
    className?: string;
    children?: ReactNode;
};

export default function UserAvatarCurrentUser({className = '', children}: Props) {
    // const userEmail = useAppSelector((state) => state.main.userEmail)
    const userEmail = 'test@test.pl';

    return (
        <UserAvatar username={userEmail} className={className}>
            {children}
        </UserAvatar>
    );
}
