import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
        text: 'Data Information',
      },
    },
};

const BarContainer = ({ labels, information }) => {
    const data = {
        labels,
        datasets: [
            {
                label: 'Cantidad',
                data: information,
                backgroundColor: 'rgba(0, 80, 197, 0.8)',
            },
        ],
    };

    return <Bar  options={options} data={data} className='barTable' />
}

export default BarContainer