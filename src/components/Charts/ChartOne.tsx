import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useLocation } from 'react-router-dom';

const defaultOptions: ApexOptions = {
  tooltip: {
    enabled: true,
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const seriesName = w.config.series[seriesIndex].name;
      return `<div style="padding: 5px; font-size: 12px;">${seriesName}</div>`;
    },
  },
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: true,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [], // Se actualizará en el useEffect
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
    labels: {
      show: false,
    },
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
  dates: string[];
}

const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Product One',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },
      {
        name: 'Product Two',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ],
    dates: [],
  });

  const [options, setOptions] = useState<ApexOptions>(defaultOptions); // Estado para opciones

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('patients')) {
      const obtenerDatosPaciente = async () => {
        // Datos simulados del paciente
        const datosPaciente = {
          sintomas: {
            ansiedad: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
            depresion: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
          },
          fechas: [
            '2024-01-01', '2024-01-08', '2024-01-15', '2024-01-22', '2024-01-29',
            '2024-02-05', '2024-02-12', '2024-02-19', '2024-02-26', '2024-03-05',
            '2024-03-12', '2024-03-19',
          ],
        };

        setState({
          series: [
            { name: 'Ansiedad', data: datosPaciente.sintomas.ansiedad },
            { name: 'Depresión', data: datosPaciente.sintomas.depresion },
          ],
          dates: datosPaciente.fechas,
        });
      };
      obtenerDatosPaciente();
    } else {
      setState({
        series: [
          { name: 'Product One', data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45] },
          { name: 'Product Two', data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51] },
        ],
        dates: [
          '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05',
          '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10',
          '2024-01-11', '2024-01-12',
        ],
      });
    }
  }, [location.pathname]);

  // Cuando las fechas cambian, actualiza las categorías del eje X
  useEffect(() => {
    if (state.dates.length > 0) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          ...prevOptions.xaxis,
          categories: state.dates, // Asignar las fechas a las categorías
        },
      }));
    }
  }, [state.dates]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          {/* Solo mostrar estos títulos si no estamos en la vista de pacientes */}
          {!location.pathname.includes('patients') && (
            <>
              <div className="flex min-w-47.5">
                <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                  <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                </span>
                <div className="w-full">
                  <p className="font-semibold text-primary">Total Revenue</p>
                  <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
                </div>
              </div>
              <div className="flex min-w-47.5">
                <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                  <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
                </span>
                <div className="w-full">
                  <p className="font-semibold text-secondary">Total Sales</p>
                  <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
