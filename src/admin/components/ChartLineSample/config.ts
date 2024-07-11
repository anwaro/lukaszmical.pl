import type {ChartData} from 'chart.js';

export const chartColors = {
    primary: '#00D1B2',
    info: '#209CEE',
    danger: '#FF3860',
};

const randomChartData = (n: number) => {
    const data = [];

    for (let i = 0; i < n; i++) {
        data.push(Math.round(Math.random() * 200));
    }

    return data;
};

const datasetObject = (
    color: keyof typeof chartColors,
    points: number,
): ChartData<'line'>['datasets'][number] => {
    return {
        fill: false,
        borderColor: chartColors[color],
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: chartColors[color],
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: chartColors[color],
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: randomChartData(points),
        tension: 0.5,
        cubicInterpolationMode: 'default',
    };
};

export const sampleChartData = (points = 9): ChartData<'line'> => {
    const labels = [];

    for (let i = 1; i <= points; i++) {
        labels.push(`0${i}`);
    }

    return {
        labels,
        datasets: [
            datasetObject('primary', points),
            datasetObject('info', points),
            datasetObject('danger', points),
        ],
    };
};
