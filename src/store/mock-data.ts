import type { DecisionMatrix } from '@/types/matrix';

// Mock data for testing the matrix structure
export const mockMatrices: DecisionMatrix[] = [
  // Template: Travel Destination
  {
    id: 'template-travel',
    title: 'Travel Destination Template',
    description: 'Compare travel destinations based on key criteria',
    icon: 'Plane',
    rows: [
      { id: 'cost', name: 'Cost', inverted: true, weight: 5 }, // Very important
      { id: 'weather', name: 'Weather', inverted: false, weight: 3 }, // Moderately important
      { id: 'culture', name: 'Culture', inverted: false, weight: 2 }, // Less important
      { id: 'safety', name: 'Safety', inverted: false, weight: 5 }, // Very important
      { id: 'language', name: 'Language Barrier', inverted: true, weight: 2 }, // Less important
    ],
    columns: [], // Templates start with no columns
    data: {},
    isTemplate: true,
    createdAt: new Date('2024-01-15'),
    lastAccessed: new Date('2024-01-15'),
  },

  // Filled Matrix: Car Purchase Decision
  {
    id: 'matrix-car',
    title: 'Car Purchase Decision',
    description: 'Comparing different car options',
    icon: 'Car',
    rows: [
      { id: 'price', name: 'Price', inverted: true, weight: 5 }, // Very important
      { id: 'reliability', name: 'Reliability', inverted: false, weight: 5 }, // Very important
      { id: 'fuel', name: 'Fuel Efficiency', inverted: false, weight: 4 }, // Important
      { id: 'comfort', name: 'Comfort', inverted: false, weight: 3 }, // Moderately important
      { id: 'maintenance', name: 'Maintenance Cost', inverted: true, weight: 4 }, // Important
    ],
    columns: [
      { id: 'honda', name: 'Honda Civic' },
      { id: 'toyota', name: 'Toyota Camry' },
      { id: 'bmw', name: 'BMW 3 Series' },
    ],
    data: {
      'Honda Civic': {
        'Price': 2, // Cheap car (low price value)
        'Reliability': 5, // Excellent reliability
        'Fuel Efficiency': 5, // Great fuel efficiency
        'Comfort': 3, // Average comfort
        'Maintenance Cost': 2, // Low maintenance cost (low cost value)
      },
      'Toyota Camry': {
        'Price': 3, // Moderate price
        'Reliability': 5, // Excellent reliability
        'Fuel Efficiency': 4, // Good fuel efficiency
        'Comfort': 4, // Good comfort
        'Maintenance Cost': 2, // Low maintenance cost
      },
      'BMW 3 Series': {
        'Price': 5, // Expensive car (high price value)
        'Reliability': 3, // Average reliability
        'Fuel Efficiency': 2, // Poor fuel efficiency
        'Comfort': 5, // Excellent comfort
        'Maintenance Cost': 5, // High maintenance cost (high cost value)
      },
    },
    isTemplate: false,
    createdAt: new Date('2024-01-20'),
    lastAccessed: new Date('2024-01-25'),
  },

  // Filled Matrix: Job Opportunities
  {
    id: 'matrix-job',
    title: 'Job Opportunities',
    description: 'Evaluating different job offers',
    icon: 'Briefcase',
    rows: [
      { id: 'salary', name: 'Salary', inverted: false, weight: 4 }, // Important
      { id: 'worklife', name: 'Work-Life Balance', inverted: false, weight: 5 }, // Very important
      { id: 'growth', name: 'Growth Potential', inverted: false, weight: 4 }, // Important
      { id: 'commute', name: 'Commute Time', inverted: true, weight: 3 }, // Moderately important
      { id: 'stress', name: 'Stress Level', inverted: true, weight: 5 }, // Very important
    ],
    columns: [
      { id: 'startup', name: 'Tech Startup' },
      { id: 'corp', name: 'Big Corporation' },
      { id: 'remote', name: 'Remote Company' },
    ],
    data: {
      'Tech Startup': {
        'Salary': 3, // Moderate salary
        'Work-Life Balance': 2, // Poor work-life balance
        'Growth Potential': 5, // Excellent growth potential
        'Commute Time': 3, // Moderate commute time
        'Stress Level': 4, // High stress (high stress value)
      },
      'Big Corporation': {
        'Salary': 4, // Good salary
        'Work-Life Balance': 3, // Average work-life balance
        'Growth Potential': 2, // Limited growth potential
        'Commute Time': 4, // Long commute time (high commute value)
        'Stress Level': 2, // Low stress (low stress value)
      },
      'Remote Company': {
        'Salary': 4, // Good salary
        'Work-Life Balance': 5, // Excellent work-life balance
        'Growth Potential': 3, // Moderate growth potential
        'Commute Time': 1, // No commute (very low commute value)
        'Stress Level': 2, // Low stress (low stress value)
      },
    },
    isTemplate: false,
    createdAt: new Date('2024-01-18'),
    lastAccessed: new Date('2024-01-22'),
  },

  // Template: House Buying
  {
    id: 'template-house',
    title: 'House Buying Template',
    description: 'Evaluate potential homes',
    icon: 'Home',
    rows: [
      { id: 'price', name: 'Price', inverted: true, weight: 5 }, // Very important
      { id: 'location', name: 'Location', inverted: false, weight: 4 }, // Important
      { id: 'size', name: 'Size', inverted: false, weight: 3 }, // Moderately important
      { id: 'condition', name: 'Condition', inverted: false, weight: 4 }, // Important
      { id: 'schools', name: 'School District', inverted: false, weight: 3 }, // Moderately important
      { id: 'commute', name: 'Commute to Work', inverted: true, weight: 4 }, // Important
    ],
    columns: [],
    data: {},
    isTemplate: true,
    createdAt: new Date('2024-01-10'),
    lastAccessed: new Date('2024-01-10'),
  },
];