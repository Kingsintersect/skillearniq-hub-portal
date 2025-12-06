import { Department, Level } from '../types/auth';
import { Parent } from './services/admin/parentService';

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

// Dummy data for parents matching the Parent interface
export const dummyParentsData: Parent[] = [
    {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        username: "john.smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        role: "parent",
        country: "USA",
        state: "California",
        lga: "Los Angeles",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        last_login_at: "2024-01-15T10:30:00Z",
        meta: { notifications_enabled: true, language: "en" },
        children: [101, 102]
    },
    {
        id: 2,
        first_name: "Sarah",
        last_name: "Johnson",
        username: "sarah.johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 234-5678",
        role: "parent",
        country: "USA",
        state: "New York",
        lga: "Manhattan",
        is_active: 1,
        email_verified: 1,
        phone_verified: 0,
        created_at: "2024-01-02T09:15:00Z",
        updated_at: "2024-01-14T14:20:00Z",
        last_login_at: "2024-01-14T14:20:00Z",
        meta: { notifications_enabled: false, language: "en" },
        children: [103]
    },
    {
        id: 3,
        first_name: "Michael",
        last_name: "Brown",
        username: "michael.brown",
        email: "michael.b@email.com",
        phone: "+1 (555) 345-6789",
        role: "parent",
        country: "USA",
        state: "Texas",
        lga: "Houston",
        is_active: 0,
        email_verified: 1,
        phone_verified: 1,
        created_at: "2024-01-03T10:30:00Z",
        updated_at: "2024-01-10T16:45:00Z",
        last_login_at: "2024-01-10T16:45:00Z",
        meta: { notifications_enabled: true, language: "en" },
        children: [104, 105, 106]
    },
    {
        id: 4,
        first_name: "Emily",
        last_name: "Davis",
        username: null,
        email: "emily.davis@email.com",
        phone: "+1 (555) 456-7890",
        role: "parent",
        country: "Canada",
        state: "Ontario",
        lga: "Toronto",
        is_active: 1,
        email_verified: 0,
        phone_verified: 1,
        created_at: "2024-01-04T11:45:00Z",
        updated_at: "2024-01-16T08:20:00Z",
        last_login_at: null,
        meta: { notifications_enabled: true, language: "fr" },
        children: [107]
    },
    {
        id: 5,
        first_name: "Robert",
        last_name: "Wilson",
        username: "robert.wilson",
        email: "robert.w@email.com",
        phone: "+1 (555) 567-8901",
        role: "parent",
        country: "USA",
        state: "Florida",
        lga: "Miami",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        created_at: "2024-01-05T12:00:00Z",
        updated_at: "2024-01-16T09:15:00Z",
        last_login_at: "2024-01-16T09:15:00Z",
        meta: { notifications_enabled: true, language: "en" },
        children: [108, 109]
    },
    {
        id: 6,
        first_name: "Jennifer",
        last_name: "Martinez",
        username: "jennifer.martinez",
        email: "jennifer.m@email.com",
        phone: "+1 (555) 678-9012",
        role: "parent",
        country: "USA",
        state: "Illinois",
        lga: "Chicago",
        is_active: 1,
        email_verified: 1,
        phone_verified: 0,
        created_at: "2024-01-06T13:15:00Z",
        updated_at: "2024-01-15T16:45:00Z",
        last_login_at: "2024-01-15T16:45:00Z",
        meta: { notifications_enabled: false, language: "es" },
        children: [110]
    },
    {
        id: 7,
        first_name: "David",
        last_name: "Anderson",
        username: null,
        email: "david.a@email.com",
        phone: "+1 (555) 789-0123",
        role: "parent",
        country: "UK",
        state: "England",
        lga: "London",
        is_active: 0,
        email_verified: 1,
        phone_verified: 1,
        created_at: "2024-01-07T14:30:00Z",
        updated_at: "2024-01-12T11:20:00Z",
        last_login_at: "2024-01-12T11:20:00Z",
        meta: { notifications_enabled: true, language: "en" },
        children: [111, 112]
    },
    {
        id: 8,
        first_name: "Lisa",
        last_name: "Taylor",
        username: "lisa.taylor",
        email: "lisa.t@email.com",
        phone: "+1 (555) 890-1234",
        role: "parent",
        country: "USA",
        state: "Washington",
        lga: "Seattle",
        is_active: 1,
        email_verified: 0,
        phone_verified: 0,
        created_at: "2024-01-08T15:45:00Z",
        updated_at: "2024-01-16T10:30:00Z",
        last_login_at: null,
        meta: { notifications_enabled: true, language: "en" },
        children: [113]
    },
    {
        id: 9,
        first_name: "James",
        last_name: "Thomas",
        username: "james.thomas",
        email: "james.t@email.com",
        phone: "+1 (555) 901-2345",
        role: "parent",
        country: "Canada",
        state: "British Columbia",
        lga: "Vancouver",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        created_at: "2024-01-09T16:00:00Z",
        updated_at: "2024-01-16T14:15:00Z",
        last_login_at: "2024-01-16T14:15:00Z",
        meta: { notifications_enabled: true, language: "en" },
        children: [114, 115]
    },
    {
        id: 10,
        first_name: "Maria",
        last_name: "Garcia",
        username: "maria.garcia",
        email: "maria.g@email.com",
        phone: "+1 (555) 012-3456",
        role: "parent",
        country: "USA",
        state: "Arizona",
        lga: "Phoenix",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        created_at: "2024-01-10T17:30:00Z",
        updated_at: "2024-01-16T13:45:00Z",
        last_login_at: "2024-01-16T13:45:00Z",
        meta: { notifications_enabled: false, language: "es" },
        children: [116]
    }
];

// Dummy data for students (for the student selection dropdown)
export const dummyStudentsData = [
    {
        id: 101,
        first_name: "Emma",
        last_name: "Smith",
        username: "emma.smith",
        email: "emma.smith@student.edu",
        phone: "+1 (555) 111-2222"
    },
    {
        id: 102,
        first_name: "Noah",
        last_name: "Smith",
        username: "noah.smith",
        email: "noah.smith@student.edu",
        phone: "+1 (555) 111-3333"
    },
    {
        id: 103,
        first_name: "Olivia",
        last_name: "Johnson",
        username: "olivia.johnson",
        email: "olivia.johnson@student.edu",
        phone: "+1 (555) 222-4444"
    },
    {
        id: 104,
        first_name: "Liam",
        last_name: "Brown",
        username: "liam.brown",
        email: "liam.brown@student.edu",
        phone: "+1 (555) 333-5555"
    },
    {
        id: 105,
        first_name: "Sophia",
        last_name: "Brown",
        username: "sophia.brown",
        email: "sophia.brown@student.edu",
        phone: "+1 (555) 333-6666"
    },
    {
        id: 106,
        first_name: "Chukwuebuka",
        last_name: "Noko",
        username: null,
        email: "user@gmail.com",
        phone: "07015363296"
    },
    {
        id: 107,
        first_name: "Mason",
        last_name: "Davis",
        username: "mason.davis",
        email: "mason.davis@student.edu",
        phone: "+1 (555) 444-7777"
    },
    {
        id: 108,
        first_name: "Ava",
        last_name: "Wilson",
        username: "ava.wilson",
        email: "ava.wilson@student.edu",
        phone: "+1 (555) 555-8888"
    },
    {
        id: 109,
        first_name: "James",
        last_name: "Wilson",
        username: "james.wilson",
        email: "james.wilson@student.edu",
        phone: "+1 (555) 555-9999"
    },
    {
        id: 110,
        first_name: "Isabella",
        last_name: "Martinez",
        username: "isabella.martinez",
        email: "isabella.martinez@student.edu",
        phone: "+1 (555) 666-0000"
    },
    {
        id: 111,
        first_name: "William",
        last_name: "Anderson",
        username: "william.anderson",
        email: "william.anderson@student.edu",
        phone: "+1 (555) 777-1111"
    },
    {
        id: 112,
        first_name: "Mia",
        last_name: "Anderson",
        username: "mia.anderson",
        email: "mia.anderson@student.edu",
        phone: "+1 (555) 777-2222"
    },
    {
        id: 113,
        first_name: "Ethan",
        last_name: "Taylor",
        username: "ethan.taylor",
        email: "ethan.taylor@student.edu",
        phone: "+1 (555) 888-3333"
    },
    {
        id: 114,
        first_name: "Charlotte",
        last_name: "Thomas",
        username: "charlotte.thomas",
        email: "charlotte.thomas@student.edu",
        phone: "+1 (555) 999-4444"
    },
    {
        id: 115,
        first_name: "Benjamin",
        last_name: "Thomas",
        username: "benjamin.thomas",
        email: "benjamin.thomas@student.edu",
        phone: "+1 (555) 999-5555"
    },
    {
        id: 116,
        first_name: "Amelia",
        last_name: "Garcia",
        username: "amelia.garcia",
        email: "amelia.garcia@student.edu",
        phone: "+1 (555) 000-6666"
    }
];

export const dummyParentsWithChildrenData: any[] = [
    {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-15T10:30:00Z",
        created_at: "2024-01-01T08:00:00Z",
        children: [
            {
                id: 101,
                first_name: "Emma",
                last_name: "Smith",
                username: "emma.smith",
                email: "emma.smith@student.edu",
                phone: "+1 (555) 111-2222",
                is_active: 1,
                email_verified: 1,
                phone_verified: 1,
                last_login_at: "2024-01-15T09:00:00Z",
                created_at: "2024-01-01T08:00:00Z"
            },
            {
                id: 102,
                first_name: "Noah",
                last_name: "Smith",
                username: "noah.smith",
                email: "noah.smith@student.edu",
                phone: "+1 (555) 111-3333",
                is_active: 1,
                email_verified: 1,
                phone_verified: 0,
                last_login_at: "2024-01-14T14:00:00Z",
                created_at: "2024-01-01T08:00:00Z"
            }
        ]
    },
    {
        id: 2,
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 234-5678",
        is_active: 1,
        email_verified: 1,
        phone_verified: 0,
        last_login_at: "2024-01-14T14:20:00Z",
        created_at: "2024-01-02T09:15:00Z",
        children: [
            {
                id: 103,
                first_name: "Olivia",
                last_name: "Johnson",
                username: "olivia.johnson",
                email: "olivia.johnson@student.edu",
                phone: "+1 (555) 222-4444",
                is_active: 1,
                email_verified: 1,
                phone_verified: 1,
                last_login_at: "2024-01-16T08:30:00Z",
                created_at: "2024-01-02T09:15:00Z"
            }
        ]
    },
    {
        id: 3,
        first_name: "Michael",
        last_name: "Brown",
        email: "michael.b@email.com",
        phone: "+1 (555) 345-6789",
        is_active: 0,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-10T16:45:00Z",
        created_at: "2024-01-03T10:30:00Z",
        children: [
            {
                id: 104,
                first_name: "Liam",
                last_name: "Brown",
                username: "liam.brown",
                email: "liam.brown@student.edu",
                phone: "+1 (555) 333-5555",
                is_active: 1,
                email_verified: 1,
                phone_verified: 1,
                last_login_at: "2024-01-15T11:00:00Z",
                created_at: "2024-01-03T10:30:00Z"
            },
            {
                id: 105,
                first_name: "Sophia",
                last_name: "Brown",
                username: "sophia.brown",
                email: "sophia.brown@student.edu",
                phone: "+1 (555) 333-6666",
                is_active: 1,
                email_verified: 0,
                phone_verified: 1,
                last_login_at: "2024-01-14T13:45:00Z",
                created_at: "2024-01-03T10:30:00Z"
            },
            {
                id: 106,
                first_name: "Chukwuebuka",
                last_name: "Noko",
                username: null,
                email: "user@gmail.com",
                phone: "07015363296",
                is_active: 1,
                email_verified: 1,
                phone_verified: 1,
                last_login_at: "2024-01-16T10:15:00Z",
                created_at: "2024-01-03T10:30:00Z"
            }
        ]
    },
    {
        id: 4,
        first_name: "Emily",
        last_name: "Davis",
        email: "emily.davis@email.com",
        phone: "+1 (555) 456-7890",
        is_active: 1,
        email_verified: 0,
        phone_verified: 1,
        last_login_at: null,
        created_at: "2024-01-04T11:45:00Z",
        children: [
            {
                id: 107,
                first_name: "Mason",
                last_name: "Davis",
                username: "mason.davis",
                email: "mason.davis@student.edu",
                phone: "+1 (555) 444-7777",
                is_active: 1,
                email_verified: 1,
                phone_verified: 1,
                last_login_at: "2024-01-16T09:00:00Z",
                created_at: "2024-01-04T11:45:00Z"
            }
        ]
    },
    {
        id: 5,
        first_name: "Robert",
        last_name: "Wilson",
        email: "robert.w@email.com",
        phone: "+1 (555) 567-8901",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-16T09:15:00Z",
        created_at: "2024-01-05T12:00:00Z",
        children: [
            {
                id: 108,
                first_name: "Ava",
                last_name: "Wilson",
                username: "ava.wilson",
                email: "ava.wilson@student.edu",
                phone: "+1 (555) 555-8888",
                is_active: 1,
                email_verified: 1,
                phone_verified: 0,
                last_login_at: "2024-01-15T15:30:00Z",
                created_at: "2024-01-05T12:00:00Z"
            },
            {
                id: 109,
                first_name: "James",
                last_name: "Wilson",
                username: "james.wilson",
                email: "james.wilson@student.edu",
                phone: "+1 (555) 555-9999",
                is_active: 0,
                email_verified: 1,
                phone_verified: 1,
                last_login_at: "2024-01-10T12:00:00Z",
                created_at: "2024-01-05T12:00:00Z"
            }
        ]
    }
];

// Dummy data for all students (for the student selection in create parent dialog)
export const dummyStudentsFullData = [
    {
        id: 101,
        first_name: "Emma",
        last_name: "Smith",
        username: "emma.smith",
        email: "emma.smith@student.edu",
        phone: "+1 (555) 111-2222",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-15T09:00:00Z",
        created_at: "2024-01-01T08:00:00Z"
    },
    {
        id: 102,
        first_name: "Noah",
        last_name: "Smith",
        username: "noah.smith",
        email: "noah.smith@student.edu",
        phone: "+1 (555) 111-3333",
        is_active: 1,
        email_verified: 1,
        phone_verified: 0,
        last_login_at: "2024-01-14T14:00:00Z",
        created_at: "2024-01-01T08:00:00Z"
    },
    {
        id: 103,
        first_name: "Olivia",
        last_name: "Johnson",
        username: "olivia.johnson",
        email: "olivia.johnson@student.edu",
        phone: "+1 (555) 222-4444",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-16T08:30:00Z",
        created_at: "2024-01-02T09:15:00Z"
    },
    {
        id: 104,
        first_name: "Liam",
        last_name: "Brown",
        username: "liam.brown",
        email: "liam.brown@student.edu",
        phone: "+1 (555) 333-5555",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-15T11:00:00Z",
        created_at: "2024-01-03T10:30:00Z"
    },
    {
        id: 105,
        first_name: "Sophia",
        last_name: "Brown",
        username: "sophia.brown",
        email: "sophia.brown@student.edu",
        phone: "+1 (555) 333-6666",
        is_active: 1,
        email_verified: 0,
        phone_verified: 1,
        last_login_at: "2024-01-14T13:45:00Z",
        created_at: "2024-01-03T10:30:00Z"
    },
    {
        id: 106,
        first_name: "Chukwuebuka",
        last_name: "Noko",
        username: null,
        email: "user@gmail.com",
        phone: "07015363296",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-16T10:15:00Z",
        created_at: "2024-01-03T10:30:00Z"
    },
    {
        id: 107,
        first_name: "Mason",
        last_name: "Davis",
        username: "mason.davis",
        email: "mason.davis@student.edu",
        phone: "+1 (555) 444-7777",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-16T09:00:00Z",
        created_at: "2024-01-04T11:45:00Z"
    },
    {
        id: 108,
        first_name: "Ava",
        last_name: "Wilson",
        username: "ava.wilson",
        email: "ava.wilson@student.edu",
        phone: "+1 (555) 555-8888",
        is_active: 1,
        email_verified: 1,
        phone_verified: 0,
        last_login_at: "2024-01-15T15:30:00Z",
        created_at: "2024-01-05T12:00:00Z"
    },
    {
        id: 109,
        first_name: "James",
        last_name: "Wilson",
        username: "james.wilson",
        email: "james.wilson@student.edu",
        phone: "+1 (555) 555-9999",
        is_active: 0,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-10T12:00:00Z",
        created_at: "2024-01-05T12:00:00Z"
    },
    {
        id: 110,
        first_name: "Isabella",
        last_name: "Martinez",
        username: "isabella.martinez",
        email: "isabella.martinez@student.edu",
        phone: "+1 (555) 666-0000",
        is_active: 1,
        email_verified: 1,
        phone_verified: 1,
        last_login_at: "2024-01-16T14:20:00Z",
        created_at: "2024-01-06T13:15:00Z"
    }
];