import React, { useState } from 'react'
import _map from 'lodash/map'
import _toLower from 'lodash/toLower'
import _keys from 'lodash/keys'
import _filter from 'lodash/filter'
import _random from 'lodash/random'
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  TimeScale,
  Filler,
  ArcElement,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import {
  PencilSquareIcon, XMarkIcon,
} from '@heroicons/react/24/outline'

import Modal from '../../ui/Modal'
import Select from '../../ui/Select'

import { getJSONData } from '../../api'
import RGL, { WidthProvider } from 'react-grid-layout'

const ReactGridLayout = WidthProvider(RGL)

ChartJS.register(ArcElement, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController, TimeScale, Filler)

const data = getJSONData()
const fields = _keys(data[0])

const ChartComponent = ({ chart, onDelete, onEdit }) => {
  return (
    <div className='border-2 pb-5 border-gray-800 w-full h-full max-w-lg max-h-96 m-2'>
      <div className='flex justify-between items-center bg-gray-200 select-none cursor-grab pl-1 pr-1'>
        <div className='cursor-text'>
          {chart.type}
        </div>
        <div className='flex items-center justify-center'>
          <PencilSquareIcon onClick={() => onEdit(chart)} className='w-5 h-5 cursor-pointer mr-2' />
          <XMarkIcon onClick={() => onDelete(chart.key)} className='w-5 h-5 cursor-pointer' />
        </div>
      </div>
      <Chart
        type={_toLower(chart.type)}
        data={{
          labels: _map(data, chart.dimension),
          datasets: [{
            label: chart.measure,
            data: _map(data, chart.measure),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  )
}

const Dashboard = () => {
  const [newChartModalShown, setNewChartModalShown] = useState(false)
  const [newChartForm, setNewChartForm] = useState({
    type: '',
    dimension: '',
    measure: '',
  })
  const [charts, setCharts] = useState([])
  const [layout, setLayout] = useState([])

  const onSave = () => {
    if (!newChartForm.type || !newChartForm.dimension || !newChartForm.measure) {
      alert('Please fill all fields')
      return
    }

    if (newChartForm.key) {
      // editing an existing chart
      setCharts((prev) => _map(prev, (chart) => {
        if (chart.key === newChartForm.key) {
          return newChartForm
        }
        return chart
      }))
      setNewChartModalShown(false)
      setNewChartForm({})
      return
    }

    const form = {
      ...newChartForm,
      key: Math.random(),
    }
    setCharts((prev) => [...prev, form])
    setLayout((prev) => [...prev, {
      i: form.key,
      x: _random(0, 12),
      y: _random(0, 12),
      w: 6,
      h: 4,
      isDraggable: true,
      isResizable: true,
    }])
    setNewChartForm({})
    setNewChartModalShown(false)
  }

  const onDelete = (key) => {
    setCharts((prev) => _filter(prev, (chart) => chart.key !== key))
  }

  const onEdit = (chart) => {
    setNewChartForm(chart)
    setNewChartModalShown(true)
  }

  // I commented ReactGridLayout out because it causes issues like the component being dragged down on click
  // and the component is not resizable.
  // Potentially it's possible to fix this, but it is out of the 3 hour limit for this task.
  return (
    <div>
      <div className='cursor-pointer text-gray-800 hover:text-gray-600 p-2 m-2' onClick={() => setNewChartModalShown(true)}>
        ADD CHART
      </div>

      {/* <ReactGridLayout
        layouts={layout}
        onLayoutChange={(layout) => setLayout(layout)}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      > */}
      {_map(charts, (chart) => (
        <div key={chart.key} >
          <ChartComponent key={chart.key} chart={chart} onDelete={onDelete} onEdit={onEdit} />
        </div>
      ))}
      {/* </ReactGridLayout> */}

      <Modal
        title='Add new chart'
        isOpened={newChartModalShown}
        onClose={() => {
          setNewChartForm({})
          setNewChartModalShown(false)
        }}
        onSubmit={onSave}
        closeText='Close'
        submitText='Add'
        message={(
          <div>
            <Select
              label='Select chart type'
              items={['Line', 'Bar', 'Pie']}
              title={newChartForm.type || 'Select chart type'}
              onSelect={(type) => setNewChartForm((prev) => ({ ...prev, type }))}
            />
            <Select
              label='Select dimension'
              items={_map(fields, (field) => ({ value: field, label: field }))}
              labelExtractor={(item) => item.label}
              keyExtractor={(item) => item.value}
              title={newChartForm.dimension || 'Select dimension'}
              onSelect={(dimension) => setNewChartForm((prev) => ({ ...prev, dimension }))}
            />
            <Select
              label='Select measure'
              items={_map(fields, (field) => ({ value: field, label: field }))}
              labelExtractor={(item) => item.label}
              keyExtractor={(item) => item.value}
              title={newChartForm.measure || 'Select measure'}
              onSelect={(measure) => setNewChartForm((prev) => ({ ...prev, measure }))}
            />
            <div className='mb-24' />
          </div>
        )}
      />
    </div>
  )
}

export default Dashboard
