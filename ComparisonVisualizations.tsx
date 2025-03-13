'use client'

import { useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts'
import { ModelResponse } from '@/app/models/ai-models'

interface ComparisonProps {
  responses: ModelResponse[]
  prompt: string
}

export default function ComparisonVisualizations({ responses, prompt }: ComparisonProps) {
  const [activeTab, setActiveTab] = useState<'time' | 'tokens' | 'radar' | 'scatter'>('time')
  
  // Early return if no responses
  if (!responses || responses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Model Comparison</h2>
        <p className="text-muted-foreground">Run tests on multiple models to see comparison visualizations.</p>
      </div>
    )
  }
  
  // Filter out responses with errors
  const validResponses = responses.filter(r => !r.error)
  
  if (validResponses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Model Comparison</h2>
        <p className="text-red-500">All model responses contained errors. Please try again.</p>
      </div>
    )
  }
  
  // Prepare data for charts
  const timeData = validResponses.map(r => ({
    name: r.model.split('-').slice(-1)[0].toUpperCase(),
    time: r.processingTime ? r.processingTime / 1000 : 0,
    fullName: r.model
  }))
  
  const tokenData = validResponses.map(r => ({
    name: r.model.split('-').slice(-1)[0].toUpperCase(),
    tokens: r.tokensUsed || 0,
    fullName: r.model
  }))
  
  // Calculate response length for each model
  const lengthData = validResponses.map(r => ({
    name: r.model.split('-').slice(-1)[0].toUpperCase(),
    length: r.text.length,
    fullName: r.model
  }))
  
  // Prepare radar chart data
  // We'll use normalized values (0-100) for each metric
  const maxTime = Math.max(...validResponses.map(r => r.processingTime || 0))
  const maxTokens = Math.max(...validResponses.map(r => r.tokensUsed || 0))
  const maxLength = Math.max(...validResponses.map(r => r.text.length))
  
  const radarData = validResponses.map(r => {
    const time = r.processingTime || 0
    const tokens = r.tokensUsed || 0
    const length = r.text.length
    
    // Invert time score so lower is better
    const timeScore = maxTime ? 100 - ((time / maxTime) * 100) : 0
    // Token efficiency (higher is better)
    const tokenScore = maxTokens ? 100 - ((tokens / maxTokens) * 100) : 0
    // Length score (higher is better)
    const lengthScore = maxLength ? (length / maxLength) * 100 : 0
    
    return {
      model: r.model.split('-').slice(-1)[0].toUpperCase(),
      fullName: r.model,
      'Response Speed': timeScore,
      'Token Efficiency': tokenScore,
      'Response Length': lengthScore,
    }
  })
  
  // Scatter plot data (time vs tokens)
  const scatterData = validResponses.map(r => ({
    name: r.model.split('-').slice(-1)[0].toUpperCase(),
    fullName: r.model,
    time: r.processingTime ? r.processingTime / 1000 : 0,
    tokens: r.tokensUsed || 0,
    length: r.text.length,
  }))
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="font-medium">{data.fullName}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)} {entry.name.toLowerCase().includes('time') ? 's' : ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Model Comparison</h2>
      
      {/* Tab navigation */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('time')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'time' 
              ? 'bg-primary text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Response Time
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'tokens' 
              ? 'bg-primary text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Token Usage
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'radar' 
              ? 'bg-primary text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Performance Radar
        </button>
        <button
          onClick={() => setActiveTab('scatter')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'scatter' 
              ? 'bg-primary text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Time vs Tokens
        </button>
      </div>
      
      {/* Chart display */}
      <div className="h-80 w-full">
        {activeTab === 'time' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              className="animate-fade-in"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fill: 'var(--foreground)' }}
              />
              <YAxis 
                label={{ 
                  value: 'Response Time (seconds)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'var(--foreground)' }
                }}
                tick={{ fill: 'var(--foreground)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="time" 
                name="Response Time (s)" 
                fill="var(--orange-subtle)" 
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {activeTab === 'tokens' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tokenData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              className="animate-fade-in"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fill: 'var(--foreground)' }}
              />
              <YAxis 
                label={{ 
                  value: 'Tokens Used', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'var(--foreground)' }
                }}
                tick={{ fill: 'var(--foreground)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="tokens" 
                name="Tokens Used" 
                fill="var(--gold)" 
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {activeTab === 'radar' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="80%" 
              data={radarData}
              className="animate-fade-in"
            >
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="model" 
                tick={{ fill: 'var(--foreground)' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: 'var(--foreground)' }}
              />
              <Radar 
                name="Response Speed" 
                dataKey="Response Speed" 
                stroke="var(--orange-subtle)" 
                fill="var(--orange-subtle)" 
                fillOpacity={0.5}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Radar 
                name="Token Efficiency" 
                dataKey="Token Efficiency" 
                stroke="var(--gold)" 
                fill="var(--gold)" 
                fillOpacity={0.5}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Radar 
                name="Response Length" 
                dataKey="Response Length" 
                stroke="var(--primary)" 
                fill="var(--primary)" 
                fillOpacity={0.5}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}
        
        {activeTab === 'scatter' && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              className="animate-fade-in"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="time" 
                name="Response Time" 
                unit="s"
                label={{ 
                  value: 'Response Time (seconds)', 
                  position: 'bottom',
                  style: { fill: 'var(--foreground)' }
                }}
                tick={{ fill: 'var(--foreground)' }}
              />
              <YAxis 
                type="number" 
                dataKey="tokens" 
                name="Tokens Used"
                label={{ 
                  value: 'Tokens Used', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'var(--foreground)' }
                }}
                tick={{ fill: 'var(--foreground)' }}
              />
              <ZAxis 
                type="number" 
                dataKey="length" 
                range={[50, 400]} 
                name="Response Length"
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Legend />
              <Scatter 
                name="Models" 
                data={scatterData} 
                fill="var(--primary)"
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Prompt: "{prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}"</p>
        <p className="mt-1">Models compared: {validResponses.length}</p>
      </div>
    </div>
  )
}
