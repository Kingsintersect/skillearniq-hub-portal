import { Department, Level } from '../types/auth';

export const FACULTY_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'engineering', label: 'Faculty of Engineering' },
    { value: 'business', label: 'Faculty of Business' },
    { value: 'arts', label: 'Faculty of Arts' },
    { value: 'science', label: 'Faculty of Science' },
    { value: 'law', label: 'Faculty of Law' },
];

export const DEPARTMENT_OPTIONS: Array<{ value: Department; label: string }> = [
    { value: 'accounting', label: 'Accounting' },
    { value: 'business-admin', label: 'Business Administration' },
    { value: 'economics', label: 'Economics' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'management', label: 'Management' },
];

export const LEVEL_OPTIONS: Array<{ value: Level; label: string }> = [
    { value: '100', label: '100 Level' },
    { value: '200', label: '200 Level' },
    { value: '300', label: '300 Level' },
    { value: '400', label: '400 Level' },
    { value: '500', label: '500 Level' },
];

export const ACCADEMIC_YEAR_OPTIONS: Array<{ value: string; label: string }> = [
    { value: '2024-2025', label: '2024/2025 Academic Session' },
    { value: '2023-2024', label: '2023/2024 Academic Session' },
];


export const GENDER_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

export const NATIONALITY_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'Nigeria', label: 'Nigeria' },
    { value: 'Others', label: 'Others' },
];

export const STATE_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'abia', label: 'Abia' },
    { value: 'adamawa', label: 'Adamawa' },
    { value: 'anambra', label: 'Anambra' },
    { value: 'bauchi', label: 'Bauchi' },
    { value: 'bayelsa', label: 'Bayelsa' },
    { value: 'benue', label: 'Benue' },
    { value: 'borno', label: 'Borno' },
    { value: 'cross-river', label: 'Cross River' },
    { value: 'delta', label: 'Delta' },
    { value: 'ebonyi', label: 'Ebonyi' },
    { value: 'edo', label: 'Edo' },
    { value: 'ekiti', label: 'Ekiti' },
    { value: 'enugu', label: 'Enugu' },
    { value: 'gombe', label: 'Gombe' },
    { value: 'imo', label: 'Imo' },
    { value: 'jigawa', label: 'Jigawa' },
    { value: 'kaduna', label: 'Kaduna' },
    { value: 'kano', label: 'Kano' },
    { value: 'katsina', label: 'Katsina' },
    { value: 'kebbi', label: 'Kebbi' },
    { value: 'kogi', label: 'Kogi' },
    { value: 'kwara', label: 'Kwara' },
    { value: 'lagos', label: 'Lagos' },
    { value: 'nasarawa', label: 'Nasarawa' },
    { value: 'niger', label: 'Niger' },
    { value: 'ogun', label: 'Ogun' },
    { value: 'ondo', label: 'Ondo' },
    { value: 'osun', label: 'Osun' },
    { value: 'oyo', label: 'Oyo' },
    { value: 'plateau', label: 'Plateau' },
    { value: 'rivers', label: 'Rivers' },
    { value: 'sokoto', label: 'Sokoto' },
    { value: 'taraba', label: 'Taraba' },
    { value: 'yobe', label: 'Yobe' },
    { value: 'zamfara', label: 'Zamfara' },
    { value: 'fct', label: 'Federal Capital Territory' },
];

export const LGA_OPTIONS: Array<{ value: string; label: string }> = [
    { value: 'ikwerre', label: 'Ikwerre' },
    { value: 'port-harcourt', label: 'Port Harcourt' },
    { value: 'obio-akpor', label: 'Obio/Akpor' },
    { value: 'eleme', label: 'Eleme' },
    { value: 'tai', label: 'Tai' },
    { value: 'gokana', label: 'Gokana' },
    { value: 'oyigbo', label: 'Oyigbo' },
    // Add more LGAs as needed
];