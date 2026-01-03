export class Profile {
    constructor(
        public id: string,
        public name: string,
        public department: string,
        public role: string
    ) { }
}

export const MockProfile = new Profile(
    "EMP-001",
    "John Doe",
    "Engineering",
    "Senior Developer"
);
