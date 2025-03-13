'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

// Define prompt template interface
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
  createdBy?: string;
  isPublic: boolean;
  rating?: number;
  usageCount?: number;
}

// Predefined prompt categories
export const promptCategories = [
  'General',
  'Creative Writing',
  'Code Generation',
  'Data Analysis',
  'Summarization',
  'Translation',
  'Question Answering',
  'Reasoning',
  'Roleplay',
  'Custom'
];

// Sample prompt templates
export const samplePromptTemplates: PromptTemplate[] = [
  {
    id: 'general-qa',
    name: 'General Q&A',
    description: 'Ask a general knowledge question',
    category: 'Question Answering',
    template: 'Answer the following question with accurate information: {{question}}',
    variables: ['question'],
    isPublic: true,
    rating: 4.8,
    usageCount: 1245
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Generate code in a specific programming language',
    category: 'Code Generation',
    template: 'Write a {{language}} function that {{task}}. Include comments explaining the code.',
    variables: ['language', 'task'],
    isPublic: true,
    rating: 4.7,
    usageCount: 982
  },
  {
    id: 'creative-story',
    name: 'Creative Story',
    description: 'Generate a creative story based on a prompt',
    category: 'Creative Writing',
    template: 'Write a {{genre}} story about {{subject}}. The story should be {{length}} and include {{elements}}.',
    variables: ['genre', 'subject', 'length', 'elements'],
    isPublic: true,
    rating: 4.6,
    usageCount: 876
  },
  {
    id: 'text-summarization',
    name: 'Text Summarization',
    description: 'Summarize a long text into a concise summary',
    category: 'Summarization',
    template: 'Summarize the following text in {{length}} sentences:\n\n{{text}}',
    variables: ['length', 'text'],
    isPublic: true,
    rating: 4.9,
    usageCount: 1532
  },
  {
    id: 'language-translation',
    name: 'Language Translation',
    description: 'Translate text from one language to another',
    category: 'Translation',
    template: 'Translate the following {{sourceLanguage}} text to {{targetLanguage}}:\n\n{{text}}',
    variables: ['sourceLanguage', 'targetLanguage', 'text'],
    isPublic: true,
    rating: 4.5,
    usageCount: 1123
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Analyze data and provide insights',
    category: 'Data Analysis',
    template: 'Analyze the following {{dataType}} data and provide insights:\n\n{{data}}',
    variables: ['dataType', 'data'],
    isPublic: true,
    rating: 4.4,
    usageCount: 765
  },
  {
    id: 'reasoning-problem',
    name: 'Reasoning Problem',
    description: 'Solve a reasoning problem step by step',
    category: 'Reasoning',
    template: 'Solve the following {{problemType}} problem step by step:\n\n{{problem}}',
    variables: ['problemType', 'problem'],
    isPublic: true,
    rating: 4.7,
    usageCount: 892
  },
  {
    id: 'character-roleplay',
    name: 'Character Roleplay',
    description: 'Roleplay as a specific character',
    category: 'Roleplay',
    template: 'You are {{character}}. Respond to the following prompt in character:\n\n{{prompt}}',
    variables: ['character', 'prompt'],
    isPublic: true,
    rating: 4.3,
    usageCount: 678
  }
];

// Custom hook for prompt templates
export function usePromptTemplates() {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<PromptTemplate[]>(samplePromptTemplates);
  const [userTemplates, setUserTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  
  // Function to get all templates (sample + user)
  const getAllTemplates = () => {
    return [...templates, ...userTemplates];
  };
  
  // Function to get templates by category
  const getTemplatesByCategory = (category: string) => {
    return getAllTemplates().filter(template => template.category === category);
  };
  
  // Function to create a new template
  const createTemplate = (template: Omit<PromptTemplate, 'id' | 'createdBy' | 'rating' | 'usageCount'>) => {
    const newTemplate: PromptTemplate = {
      ...template,
      id: `user-${Date.now()}`,
      createdBy: session?.user?.email || 'anonymous',
      rating: 0,
      usageCount: 0
    };
    
    setUserTemplates([...userTemplates, newTemplate]);
    return newTemplate;
  };
  
  // Function to update a template
  const updateTemplate = (id: string, updates: Partial<PromptTemplate>) => {
    if (id.startsWith('user-')) {
      setUserTemplates(userTemplates.map(template => 
        template.id === id ? { ...template, ...updates } : template
      ));
    }
  };
  
  // Function to delete a template
  const deleteTemplate = (id: string) => {
    if (id.startsWith('user-')) {
      setUserTemplates(userTemplates.filter(template => template.id !== id));
    }
  };
  
  // Function to select a template
  const selectTemplate = (id: string) => {
    const template = getAllTemplates().find(t => t.id === id) || null;
    setSelectedTemplate(template);
    
    // Initialize variable values
    if (template) {
      const initialValues: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialValues[variable] = '';
      });
      setVariableValues(initialValues);
    } else {
      setVariableValues({});
    }
  };
  
  // Function to update a variable value
  const updateVariableValue = (variable: string, value: string) => {
    setVariableValues({
      ...variableValues,
      [variable]: value
    });
  };
  
  // Function to generate the final prompt with variables replaced
  const generatePrompt = () => {
    if (!selectedTemplate) return '';
    
    let prompt = selectedTemplate.template;
    
    // Replace all variables in the template
    Object.entries(variableValues).forEach(([variable, value]) => {
      prompt = prompt.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });
    
    return prompt;
  };
  
  // Function to check if all variables have values
  const areAllVariablesFilled = () => {
    if (!selectedTemplate) return false;
    
    return selectedTemplate.variables.every(variable => 
      variableValues[variable] && variableValues[variable].trim() !== ''
    );
  };
  
  return {
    templates: getAllTemplates(),
    userTemplates,
    selectedTemplate,
    variableValues,
    selectTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByCategory,
    updateVariableValue,
    generatePrompt,
    areAllVariablesFilled
  };
}
