'use client'

import { useState } from 'react'
import { usePromptTemplates, PromptTemplate, promptCategories } from '@/app/prompts/prompt-templates'

export default function PromptTemplateInterface() {
  const {
    templates,
    userTemplates,
    selectedTemplate,
    variableValues,
    selectTemplate,
    createTemplate,
    deleteTemplate,
    updateVariableValue,
    generatePrompt,
    areAllVariablesFilled
  } = usePromptTemplates()

  const [activeCategory, setActiveCategory] = useState('General')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<PromptTemplate>>({
    name: '',
    description: '',
    category: 'General',
    template: '',
    variables: [],
    isPublic: true
  })
  const [newVariable, setNewVariable] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')

  // Handle template selection
  const handleSelectTemplate = (id: string) => {
    selectTemplate(id)
    setGeneratedPrompt('')
  }

  // Handle variable value change
  const handleVariableChange = (variable: string, value: string) => {
    updateVariableValue(variable, value)
  }

  // Handle generate prompt
  const handleGeneratePrompt = () => {
    const prompt = generatePrompt()
    setGeneratedPrompt(prompt)
  }

  // Handle new template form change
  const handleNewTemplateChange = (field: keyof PromptTemplate, value: any) => {
    setNewTemplate({
      ...newTemplate,
      [field]: value
    })
  }

  // Handle adding a new variable
  const handleAddVariable = () => {
    if (newVariable.trim() && !newTemplate.variables?.includes(newVariable)) {
      setNewTemplate({
        ...newTemplate,
        variables: [...(newTemplate.variables || []), newVariable]
      })
      setNewVariable('')
    }
  }

  // Handle removing a variable
  const handleRemoveVariable = (variable: string) => {
    setNewTemplate({
      ...newTemplate,
      variables: newTemplate.variables?.filter(v => v !== variable) || []
    })
  }

  // Handle creating a new template
  const handleCreateTemplate = () => {
    if (
      newTemplate.name &&
      newTemplate.description &&
      newTemplate.category &&
      newTemplate.template &&
      newTemplate.variables?.length
    ) {
      createTemplate(newTemplate as Omit<PromptTemplate, 'id' | 'createdBy' | 'rating' | 'usageCount'>)
      setNewTemplate({
        name: '',
        description: '',
        category: 'General',
        template: '',
        variables: [],
        isPublic: true
      })
      setShowCreateForm(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in">Prompt Templates</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Template Selection Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-primary">Templates</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Create New'}
            </button>
          </div>
          
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {promptCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Template list */}
          {!showCreateForm ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {templates.filter(t => t.category === activeCategory).length > 0 ? (
                templates.filter(t => t.category === activeCategory).map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      {template.id.startsWith('user-') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTemplate(template.id)
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <span className="mr-2">Variables: {template.variables.length}</span>
                      {template.rating && (
                        <span className="mr-2">★ {template.rating.toFixed(1)}</span>
                      )}
                      {template.usageCount && (
                        <span>Used {template.usageCount} times</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No templates in this category
                </p>
              )}
            </div>
          ) : (
            /* Create new template form */
            <div className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Template Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => handleNewTemplateChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={newTemplate.description}
                  onChange={(e) => handleNewTemplateChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                  placeholder="Enter template description"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={newTemplate.category}
                  onChange={(e) => handleNewTemplateChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                >
                  {promptCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-foreground mb-1">
                  Template Text
                </label>
                <textarea
                  id="template"
                  rows={4}
                  value={newTemplate.template}
                  onChange={(e) => handleNewTemplateChange('template', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                  placeholder="Enter template text with {{variable}} placeholders"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Use {{variableName}} syntax for variables
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Variables
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                    placeholder="Add variable"
                  />
                  <button
                    onClick={handleAddVariable}
                    className="px-3 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {newTemplate.variables?.map(variable => (
                    <div
                      key={variable}
                      className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                    >
                      <span>{variable}</span>
                      <button
                        onClick={() => handleRemoveVariable(variable)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={newTemplate.isPublic}
                  onChange={(e) => handleNewTemplateChange('isPublic', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-foreground">
                  Make template public
                </label>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.name || !newTemplate.description || !newTemplate.template || !newTemplate.variables?.length}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Template
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Template Usage Panel */}
        <div className="lg:col-span-2 space-y-8">
          {selectedTemplate ? (
            <>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{selectedTemplate.name}</h2>
                <p className="text-muted-foreground mb-6">{selectedTemplate.description}</p>
                
                <div className="space-y-4">
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable}>
                      <label htmlFor={variable} className="block text-sm font-medium text-foreground mb-1">
                        {variable.charAt(0).toUpperCase() + variable.slice(1)}
                      </label>
                      <input
                        id={variable}
                        type="text"
                        value={variableValues[variable] || ''}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                        placeholder={`Enter ${variable}`}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleGeneratePrompt}
                    disabled={!areAllVariablesFilled()}
                    className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors animate-pulse"
                  >
                    Generate Prompt
                  </button>
                </div>
              </div>
              
              {generatedPrompt && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up">
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Generated Prompt</h2>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="whitespace-pre-wrap">{generatedPrompt}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPrompt);
                      }}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-foreground rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-slide-up flex flex-col items-center justify-center h-64">
              <h2 className="text-2xl font-semibold mb-2 text-primary">Select a Template</h2>
              <p className="text-muted-foreground text-center">
                Choose a prompt template from the list or create you<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>