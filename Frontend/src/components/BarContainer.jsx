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
                backgroundColor: 'rgb(127, 133, 255, 0.7)',
            },
        ],
    };

    return <Bar  options={options} data={data} className='barTable' />
}

export default BarContainer