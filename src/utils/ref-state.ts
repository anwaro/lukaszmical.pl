import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

const useMounted = () => {
    const mounted = useRef(false);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    return mounted;
};

export function useRefState<S>(
    initialState: S | (() => S),
    blockIfUnmounted: boolean = true,
): [S, MutableRefObject<S>, Dispatch<SetStateAction<S>>] {
    const mounted = useMounted();
    const [reactState, setReactState] = useState(initialState);
    const stateRef = useRef(reactState);
    const setState = useCallback((arg) => {
        if (!mounted.current && blockIfUnmounted) return;
        stateRef.current = typeof arg === 'function' ? arg(stateRef.current) : arg;
        setReactState(stateRef.current);
    }, []);
    return [reactState, stateRef, setState];
}
