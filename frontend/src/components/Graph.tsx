
import CrossIcon from "$/assets/icons/cross-small-emerald-300.svg"
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  defaults,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


//defaults.font.family ='Montserrat'

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
      tooltip:{
        enabled : true,
        callbacks: {
            label: (item : any) => `${item.raw} °C`
          },
      },
      legend: {
        align : 'start' as const,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Temperature [ °C / calendar month ]',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  


type Props = {
    onClose : { fn: () => void }
}
export default function Graph(props : Props){

    const data = {
        labels,
        datasets: [
          {
            label: 'Present day',
            data: labels.map((_n : string, i : number) => Math.floor(Math.random() * 35)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Dataset 2',
            data: labels.map((_n : string, i : number) => Math.floor(Math.random() * 34)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };

      
    return(
        <div className="flex-grow flex flex-row my-5">
            <div className={`h-full flex-grow w-full mx-5 p-5 max-h-full
                rounded-md bg-slate-300 overflow-y-auto overflow-x-hidden`}>
                <CrossIcon
                    className="w-10 h-10 cursor-pointer text-slate-500 hover:text-slate-600"
                    onClick={() => props.onClose.fn()}
                />

                <Line options={options} data={data} />;

            </div>
        </div>        
    )
}


