// types/teacher.ts
export interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone: string;
    is_active: boolean;
    email_verified: boolean;
    meta: string[];
    teacher: {
        employee_no: string;
        hire_date: string;
        subjects: string[];
    };
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
}

export interface Course {
    id: number;
    fullname: string;
    shortname: string;
    category_id: number;
    is_active: boolean;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    teacher: {
        id: number;
        first_name: string;
        last_name: string;
    };
}

export interface TeacherSubject {
    id: number;
    subject: {
        id: number;
        name: string;
        code: string;
    };
    teacher: {
        id: number;
        first_name: string;
        last_name: string;
    };
}

export interface CreateTeacherPayload {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone: string;
    password: string;
    teacher: {
        employee_no: string;
        hire_date: string;
        subjects: string[];
    };
}

export interface AssignTeacherPayload {
    class_group_id: number;
    subject_id: number;
    teacher_id: number;
    start_date: string;
    end_date: string;
    meta: {
        semester: string;
        room: string;
    };
}

export interface TeachersResponse {
    data: Teacher[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface CategoriesResponse {
    data: Category[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface CoursesResponse {
    data: Course[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface TeacherSubjectsResponse {
    data: TeacherSubject[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}


// data/mockData.ts
export const mockCategories: Category[] = [
    {
        id: 1,
        name: "Science",
        description: "Science related courses",
        is_active: true
    },
    {
        id: 2,
        name: "Mathematics",
        description: "Mathematics courses",
        is_active: true
    },
    {
        id: 3,
        name: "Languages",
        description: "Language courses",
        is_active: true
    },
    {
        id: 4,
        name: "Arts",
        description: "Arts and creative courses",
        is_active: true
    },
    {
        id: 5,
        name: "Technology",
        description: "Technology and computer courses",
        is_active: true
    }
];

export const mockCourses: Course[] = [
    {
        id: 1,
        fullname: "Introduction to Physics",
        shortname: "PHY101",
        category_id: 1,
        is_active: true
    },
    {
        id: 2,
        fullname: "Advanced Calculus",
        shortname: "MATH201",
        category_id: 2,
        is_active: true
    },
    {
        id: 3,
        fullname: "English Literature",
        shortname: "ENG301",
        category_id: 3,
        is_active: true
    },
    {
        id: 4,
        fullname: "Digital Art Fundamentals",
        shortname: "ART101",
        category_id: 4,
        is_active: true
    },
    {
        id: 5,
        fullname: "Web Development",
        shortname: "CS401",
        category_id: 5,
        is_active: true
    },
    {
        id: 6,
        fullname: "Organic Chemistry",
        shortname: "CHEM202",
        category_id: 1,
        is_active: true
    }
];

export const mockTeachers: Teacher[] = [
    {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        email: "john.smith@school.edu",
        username: "jsmith",
        phone: "+1234567890",
        is_active: true,
        email_verified: true,
        meta: [],
        teacher: {
            employee_no: "EMP001",
            hire_date: "2020-08-15",
            subjects: ["Physics", "Mathematics"]
        }
    },
    {
        id: 2,
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah.johnson@school.edu",
        username: "sjohnson",
        phone: "+1234567891",
        is_active: true,
        email_verified: true,
        meta: [],
        teacher: {
            employee_no: "EMP002",
            hire_date: "2019-03-10",
            subjects: ["Chemistry", "Biology"]
        }
    },
    {
        id: 3,
        first_name: "Michael",
        last_name: "Brown",
        email: "michael.brown@school.edu",
        username: "mbrown",
        phone: "+1234567892",
        is_active: true,
        email_verified: false,
        meta: [],
        teacher: {
            employee_no: "EMP003",
            hire_date: "2021-01-20",
            subjects: ["English", "Literature"]
        }
    },
    {
        id: 4,
        first_name: "Emily",
        last_name: "Davis",
        email: "emily.davis@school.edu",
        username: "edavis",
        phone: "+1234567893",
        is_active: false,
        email_verified: true,
        meta: [],
        teacher: {
            employee_no: "EMP004",
            hire_date: "2018-11-05",
            subjects: ["Art", "Design"]
        }
    },
    {
        id: 5,
        first_name: "Robert",
        last_name: "Wilson",
        email: "robert.wilson@school.edu",
        username: "rwilson",
        phone: "+1234567894",
        is_active: true,
        email_verified: true,
        meta: [],
        teacher: {
            employee_no: "EMP005",
            hire_date: "2022-02-28",
            subjects: ["Computer Science", "Programming"]
        }
    },
    {
        id: 6,
        first_name: "Lisa",
        last_name: "Anderson",
        email: "lisa.anderson@school.edu",
        username: "landerson",
        phone: "+1234567895",
        is_active: true,
        email_verified: true,
        meta: [],
        teacher: {
            employee_no: "EMP006",
            hire_date: "2020-09-12",
            subjects: ["Mathematics", "Statistics"]
        }
    },
    {
        id: 7,
        first_name: "David",
        last_name: "Martinez",
        email: "david.martinez@school.edu",
        username: "dmartinez",
        phone: "+1234567896",
        is_active: true,
        email_verified: false,
        meta: [],
        teacher: {
            employee_no: "EMP007",
            hire_date: "2021-07-15",
            subjects: ["History", "Social Studies"]
        }
    },
    {
        id: 8,
        first_name: "Jennifer",
        last_name: "Taylor",
        email: "jennifer.taylor@school.edu",
        username: "jtaylor",
        phone: "+1234567897",
        is_active: true,
        email_verified: true,
        meta: [],
        teacher: {
            employee_no: "EMP008",
            hire_date: "2019-12-01",
            subjects: ["Music", "Performing Arts"]
        }
    }
];

export const mockTeacherSubjects: TeacherSubject[] = [
    {
        id: 1,
        subject: {
            id: 1,
            name: "Physics",
            code: "PHY101"
        },
        teacher: {
            id: 1,
            first_name: "John",
            last_name: "Smith"
        }
    },
    {
        id: 2,
        subject: {
            id: 2,
            name: "Advanced Calculus",
            code: "MATH201"
        },
        teacher: {
            id: 1,
            first_name: "John",
            last_name: "Smith"
        }
    },
    {
        id: 3,
        subject: {
            id: 6,
            name: "Organic Chemistry",
            code: "CHEM202"
        },
        teacher: {
            id: 2,
            first_name: "Sarah",
            last_name: "Johnson"
        }
    },
    {
        id: 4,
        subject: {
            id: 3,
            name: "English Literature",
            code: "ENG301"
        },
        teacher: {
            id: 3,
            first_name: "Michael",
            last_name: "Brown"
        }
    },
    {
        id: 5,
        subject: {
            id: 5,
            name: "Web Development",
            code: "CS401"
        },
        teacher: {
            id: 5,
            first_name: "Robert",
            last_name: "Wilson"
        }
    }
];