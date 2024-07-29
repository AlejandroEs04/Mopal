import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import useAdmin from '../hooks/useAdmin'
import { useMemo } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

const labels = ['Enero', 'Febrero', 'Marzo']

const Statistics = () => {
    const { reportInfo } = useAdmin();

    const seasons = useMemo(() => reportInfo?.salesPerPeriodo?.map(periodo => {
        const total = periodo?.Products?.reduce((total, product) => total + product.Quantity, 0)
        return total
    }), [reportInfo])

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: seasons,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="mt-2">
            <h1>Estadisticas</h1>
            <p>Analisis de todos los movimientos realizados</p>

            <Line 
                options={options}
                data={data}
            /> 
        </div>
    )
}

export default Statistics