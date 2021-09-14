import {useEffect, useMemo, useRef, useState} from 'react';

const maxWidth = 1260;
const breakPoint = 900;
const imageRatio = 0.5;
const space = 10;

export default function useGridLayout(
    items: number,
    columnNumber = 3,
    minWidth = 300,
) {
    const bodyWidth = () => (process?.browser ? document.body.clientWidth : 1000);
    const [windowWidth, setWindowWidth] = useState(bodyWidth());
    const [columns, setColumns] = useState(columnNumber);
    const [itemWidth, setItemWidth] = useState(bodyWidth() / columnNumber);
    const windowWidthRef = useRef(windowWidth);

    const padding = useMemo(
        () => 2 * (windowWidth <= breakPoint ? 15 : 30),
        [windowWidth],
    );
    const containerWidth = useMemo(
        () => Math.min(maxWidth, windowWidth) - padding,
        [windowWidth, padding],
    );
    const itemHeight = useMemo(() => itemWidth * imageRatio, [itemWidth]);

    const containerHeight = useMemo(() => {
        const rows = Math.ceil(items / columns);
        return rows * itemHeight + (rows - 1) * space;
    }, [itemHeight, items, columns]);

    useEffect(() => {
        const calculateWidth = (num: number): number => {
            if (num === 1) {
                setColumns(1);
                return containerWidth;
            }
            const _itemWidth = (containerWidth - (num - 1) * space) / num;
            if (_itemWidth > minWidth) {
                setColumns(num);
                return _itemWidth;
            }
            return calculateWidth(num - 1);
        };
        setItemWidth(calculateWidth(columnNumber));
    }, [containerWidth]);

    useEffect(() => {
        windowWidthRef.current = windowWidth;
    }, [windowWidth]);

    useEffect(() => {
        let timeId = 0;
        const windowResize = () => {
            clearTimeout(timeId);
            timeId = window.setTimeout(() => setWindowWidth(bodyWidth()), 500);
            if (Math.abs(windowWidthRef.current - bodyWidth()) > 200) {
                setWindowWidth(bodyWidth());
            }
        };
        window.addEventListener('resize', windowResize);

        return () => {
            window.removeEventListener('resize', windowResize);
        };
    }, []);

    return {itemWidth, containerWidth, containerHeight, columns, itemHeight};
}
