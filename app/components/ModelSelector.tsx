'use client'

import { useState } from 'react'
import { useAIModels, AIModel } from '@/app/models/ai-models-enhanced'

export default function ModelSelector() {
  const {
    filteredModels,
    selectedModels,
    selectModel,
    deselectModel,
    filterModels,
    resetFilters,
    getUniqueProviders,
    getUniqueCapabilities,
    filterCriteria
  } = useAIModels()

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Filter models by search query
  const searchFilteredModels = searchQuery 
    ? filteredModels.filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredModels

  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'provider':
        filterModels({ provider: value });
        break;
      case 'capability':
        filterModels({ capability: value });
        break;
      case 'contextSize':
        filterModels({ contextSize: value });
        break;
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-primary">AI Models</h2>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
              />
              <svg 
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/90 transition-colors flex items-center"
          >
            <svg 
              className="h-4 w-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
              />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {(filterCriteria.provider || filterCriteria.capability || filterCriteria.contextSize) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-foreground rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md animate-slide-down">
            <div>
              <label htmlFor="providerFilter" className="block text-sm font-medium text-foreground mb-1">
                Provider
              </label>
              <select
                id="providerFilter"
                value={filterCriteria.provider}
                onChange={(e) => handleFilterChange('provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
              >
                <option value="">All Providers</option>
                {getUniqueProviders().map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="capabilityFilter" className="block text-sm font-medium text-foreground mb-1">
                Capability
              </label>
              <select
                id="capabilityFilter"
                value={filterCriteria.capability}
                onChange={(e) => handleFilterChange('capability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
              >
                <option value="">All Capabilities</option>
                {getUniqueCapabilities().map(capability => (
                  <option key={capability} value={capability}>{capability.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="contextSizeFilter" className="block text-sm font-medium text-foreground mb-1">
                Context Window
              </label>
              <select
                id="contextSizeFilter"
                value={filterCriteria.contextSize}
                onChange={(e) => handleFilterChange('contextSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
              >
                <option value="">All Sizes</option>
                <option value="small">Small (≤ 8K)</option>
                <option value="medium">Medium (8K - 32K)</option>
                <option value="large">Large (> 32K)</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected models */}
      {selectedModels.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Selected Models</h3>
          <div className="flex flex-wrap gap-2">
            {selectedModels.map(modelId => {
              const model = filteredModels.find(m => m.id === modelId);
              return (
                <div 
                  key={modelId}
                  className="px-3 py-1.5 bg-primary/10 border border-primary rounded-full flex items-center"
                >
                  <span className="mr-2">{model?.name || modelId}</span>
                  <button
                    onClick={() => deselectModel(modelId)}
                    className="h-5 w-5 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
                  >
                    <svg 
                      className="h-3 w-3 text-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Model cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchFilteredModels.length > 0 ? (
          searchFilteredModels.map(model => (
            <ModelCard 
              key={model.id} 
              model={model} 
              isSelected={selectedModels.includes(model.id)}
              onSelect={() => selectModel(model.id)}
              onDeselect={() => deselectModel(model.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No models found matching your criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  )
}

interface ModelCardProps {
  model: AIModel;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}

function ModelCard({ model, isSelected, onSelect, onDeselect }: ModelCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <div 
      className={`rounded-lg border p-4 transition-all duration-300 hover:shadow-md ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-lg">{model.name}</h3>
          <p className="text-sm text-muted-foreground">{model.provider}</p>
        </div>
        <button
          onClick={isSelected ? onDeselect : onSelect}
          className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${
            isSelected 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {isSelected ? (
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          ) : (
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          )}
        </button>
      </div>
      
      <p className="text-sm mb-3 line-clamp-2">{model.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {model.capabilities.slice(0, 3).map(capability => (
          <span 
            key={capability}
            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
          >
            {capability.replace('-', ' ')}
          </span>
        ))}
        {model.capabilities.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
            +{model.capabilities.length - 3} more
          </span>
        )}
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs text-primary hover:text-primary/90 transition-colors flex items-center"
      >
        {showDetails ? 'Hide details' : 'Show details'}
        <svg 
          className={`h-3 w-3 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs space-y-2 animate-fade-in">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Context Window:</span>
            <span>{model.contextWindow?.toLocaleString() || 'Unknown'} tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Output:</span>
            <span>{model.maxTokens?.toLocaleString() || 'Unknown'} tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">API Type:</span>
            <span className="capitalize">{model.apiType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Released:</span>
            <span>{model.releaseDate || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pricing:</span>
            <span>{model.pricingInfo || 'Unknown'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
