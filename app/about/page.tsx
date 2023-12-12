'use client';
import { title } from '@/components/primitives';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import apiData from './data.json'
import {Button} from "@nextui-org/button";

import * as echarts from 'echarts/core';
import {
	DatasetComponent,
	TitleComponent,
	ToolboxComponent,
	TooltipComponent,
	GridComponent,
	VisualMapComponent,
	DataZoomComponent,
} from 'echarts/components';
import { CandlestickChart, BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useState } from 'react';

echarts.use([
	DatasetComponent,
	TitleComponent,
	ToolboxComponent,
	TooltipComponent,
	GridComponent,
	VisualMapComponent,
	DataZoomComponent,
	CandlestickChart,
	BarChart,
	CanvasRenderer,
]);

const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';
const dataCount = 20;

function getSign(data, dataIndex, openVal, closeVal, closeDimIdx) {
	let sign;
	if (openVal > closeVal) {
		sign = -1;
	} else if (openVal < closeVal) {
		sign = 1;
	} else {
		sign = dataIndex > 0 ? data[dataIndex - 1][closeDimIdx] <= closeVal ? 1 : -1 : 1;
	}

	return sign;
}

export default function AboutPage() {
	const [options, setOptions] = useState({
		dataset: {
			source: []
		},
		title: {
			text: 'Candle stick chart'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'line'
			}
		},
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: false
				}
			}
		},
		grid: [
			{
				left: '10%',
				right: '10%',
				bottom: 200
			},
			{
				left: '10%',
				right: '10%',
				height: 80,
				bottom: 80
			}
		],
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				// inverse: true,
				axisLine: { onZero: false },
				splitLine: { show: false },
				min: 'dataMin',
				max: 'dataMax'
			},
			{
				type: 'category',
				gridIndex: 1,
				boundaryGap: false,
				axisLine: { onZero: false },
				axisTick: { show: false },
				splitLine: { show: false },
				axisLabel: { show: false },
				min: 'dataMin',
				max: 'dataMax'
			}
		],
		yAxis: [
			{
				scale: true,
				splitArea: {
					show: true
				}
			},
			{
				scale: true,
				gridIndex: 1,
				splitNumber: 2,
				axisLabel: { show: false },
				axisLine: { show: false },
				axisTick: { show: false },
				splitLine: { show: false }
			}
		],
		dataZoom: [
			{
				type: 'inside',
				xAxisIndex: [0, 1],
				start: 10,
				end: 100
			},
			{
				show: false,
				xAxisIndex: [0, 1],
				type: 'slider',
				bottom: 10,
				start: 10,
				end: 100
			}
		],
		visualMap: {
			show: false,
			seriesIndex: 1,
			dimension: 6,
			pieces: [
				{
					value: 1,
					color: upColor
				},
				{
					value: -1,
					color: downColor
				}
			]
		},
		series: [
			{
				type: 'candlestick',
				itemStyle: {
					color: upColor,
					color0: downColor,
					borderColor: upBorderColor,
					borderColor0: downBorderColor
				},
				encode: {
					x: 0,
					y: [1, 4, 3, 2]
				}
			},
			{
				name: 'Volumn',
				type: 'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				itemStyle: {
					color: '#7fbe9e'
				},
				large: true,
				encode: {
					x: 0,
					y: 5
				}
			}
		]
	});

	useEffect(() => {
		// fetch(
		// 	'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=4ONBDQONFK53NID7',
		// )
		// 	.then((res) => res.json())
		// 	.then((result) => {
		// 		let timeSeries = result['Time Series (5min)'];
		// 		let refinedData = [];
		// 		Object.keys(timeSeries).forEach((key, i) => {
		// 			refinedData[i] = [
		// 				key,
		// 				timeSeries[key]['1. open'],
		// 				timeSeries[key]['4. close'],
		// 				timeSeries[key]['3. low'],
		// 				timeSeries[key]['2. high'],
		// 				timeSeries[key]['5. volume'],
		// 				1,
		// 			];
		// 		});
		//
		// 		console.log(refinedData);
		// 		setOptions(data => {
		// 			return {
		// 				...data,
		// 				dataset: {
		// 					source: refinedData,
		// 				},
		// 			}
		// 		})
		// 	});
		let timeSeries = apiData['Time Series (1min)']
		let refinedData = []
		Object.keys(timeSeries).forEach((key,i) => {
			refinedData[i]= [
				key,
				timeSeries[key]['1. open'],
				timeSeries[key]['2. high'],
				timeSeries[key]['3. low'],
				timeSeries[key]['4. close'],
				timeSeries[key]['5. volume'],
				getSign(timeSeries, key, timeSeries[key]['1. open'], timeSeries[key]['4. close'], 4),
			]
		})
		setOptions(data => {
			const newData = {...data}
			delete newData.dataset

			return {
				dataset: {
					source: refinedData,
				},
				...newData
			}
		})
	}, []);

	return (
		<div className='w-full h-4/5'>
			<h1 className={title()}>About</h1>
			<ReactEChartsCore
				style={{ height: 500 }}
				opts={{ height: 500 }}
				echarts={echarts}
				option={options}
				notMerge
				lazyUpdate
			/>
			<div className="w-full flex">
				<div className="w-1/3"></div>
				<div className="w-1/3 flex justify-around">
					<Button color="success" variant="ghost">Buy</Button>
					<Button color="danger" variant="ghost">Sell</Button>
				</div>
				<div className="w-1/3"></div>
			</div>
		</div>
	);
}
