import yaml from 'js-yaml';
import type { DecisionMatrix, CreateMatrixInput } from '@/types/matrix';
import { createMatrix } from './matrix-utils';

interface YamlMatrixData {
  title: string;
  description?: string;
  icon?: string;
  isTemplate?: boolean;
  criteria: Array<{
    name: string;
    weight: number;
    inverted?: boolean;
  }>;
  options?: string[];
}

/**
 * Parse YAML string into a DecisionMatrix
 */
export function parseYamlToMatrix(yamlString: string): DecisionMatrix {
  try {
    // Parse YAML
    const data = yaml.load(yamlString) as YamlMatrixData;
    
    // Validate required fields
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid YAML: Expected an object');
    }
    
    if (!data.title || typeof data.title !== 'string') {
      throw new Error('Invalid YAML: "title" field is required and must be a string');
    }
    
    if (!Array.isArray(data.criteria) || data.criteria.length === 0) {
      throw new Error('Invalid YAML: "criteria" field is required and must be a non-empty array');
    }
    
    // Validate criteria
    data.criteria.forEach((criterion, index) => {
      if (!criterion.name || typeof criterion.name !== 'string') {
        throw new Error(`Invalid criteria[${index}]: "name" is required and must be a string`);
      }
      if (typeof criterion.weight !== 'number' || criterion.weight < 1 || criterion.weight > 5) {
        throw new Error(`Invalid criteria[${index}]: "weight" must be a number between 1 and 5`);
      }
    });
    
    // Determine if this is a template
    const isTemplate = data.isTemplate === true;
    
    // For non-templates, validate options
    if (!isTemplate) {
      if (!Array.isArray(data.options) || data.options.length === 0) {
        throw new Error('Invalid YAML: Non-template matrices require "options" field with at least one option');
      }
    }
    
    // Create matrix input
    const matrixInput: CreateMatrixInput = {
      title: data.title,
      description: data.description,
      icon: data.icon || 'BarChart3',
      isTemplate,
      rows: data.criteria.map(criterion => ({
        name: criterion.name,
        weight: criterion.weight,
        inverted: criterion.inverted || false,
      })),
      columns: isTemplate ? [] : (data.options || []).map(name => ({ name })),
    };
    
    // Create and return the matrix
    return createMatrix(matrixInput);
    
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      throw new Error(`YAML parsing error: ${error.message}`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while parsing YAML');
  }
}

/**
 * Validate YAML string without creating a matrix
 */
export function validateYaml(yamlString: string): { isValid: boolean; error?: string } {
  try {
    parseYamlToMatrix(yamlString);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Generate example YAML for a given decision type
 */
export function generateExampleYaml(decisionType: string): string {
  const examples: Record<string, YamlMatrixData> = {
    car: {
      title: "Car Purchase Decision",
      description: "Comparing different car options",
      icon: "Car",
      isTemplate: false,
      criteria: [
        { name: "Price", weight: 5, inverted: true },
        { name: "Reliability", weight: 5, inverted: false },
        { name: "Fuel Efficiency", weight: 4, inverted: false },
        { name: "Comfort", weight: 3, inverted: false },
      ],
      options: ["Honda Civic", "Toyota Camry", "BMW 3 Series"],
    },
    job: {
      title: "Job Opportunities Template",
      description: "Template for evaluating job offers",
      icon: "Briefcase",
      isTemplate: true,
      criteria: [
        { name: "Salary", weight: 4, inverted: false },
        { name: "Work-Life Balance", weight: 5, inverted: false },
        { name: "Growth Potential", weight: 4, inverted: false },
        { name: "Commute Time", weight: 3, inverted: true },
        { name: "Stress Level", weight: 5, inverted: true },
      ],
    },
  };
  
  const example = examples[decisionType] || examples.car;
  return yaml.dump(example, { indent: 2, lineWidth: -1 });
}