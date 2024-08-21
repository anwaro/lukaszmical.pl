import {Client} from '@/admin/interfaces';
import {useClients} from '@/admin/hooks/clients';
import {useHistory} from '@/admin/hooks/history';

export const useSampleClients = () => {
    const {data} = useClients();

    return {
        clients: (data ?? []) as Client[],
        isLoading: !data,
        isError: '',
    };
};

export const useSampleTransactions = () => {
    const {data} = useHistory();

    return {
        transactions: data ?? [],
        isLoading: !data,
        isError: '',
    };
};
