import { faker } from "@faker-js/faker";

export type User = {
  userId: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  registeredAt: string;
};
export type Employee = {
  userId: string;
  username: string;
  email: string;
  employedAt: string;
};

export type QUERY_INFO = {
  columns: string[];
  tableName: string;
  orderBy: { type: string; column: string } | null;
};

function createRandomUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate().getFullYear().toString(),
    registeredAt: faker.date.past().getUTCFullYear().toString(),
  };
}

function createRandomEmployee() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    employedAt: faker.date.past().getUTCFullYear().toString(),
  };
}

export const numberOfRecords = 100000;

const USERS: User[] = faker.helpers.multiple(createRandomUser, {
  count: numberOfRecords,
});
const EMPLOYEES: Employee[] = faker.helpers.multiple(createRandomEmployee, {
  count: numberOfRecords,
});

const USERS_COPY: User[] = USERS;
const EMPLOYEES_COPY: Employee[] = EMPLOYEES;

export const db = {
  users: USERS,
  employees: EMPLOYEES,
  users_copy: USERS_COPY,
  employees_copy: EMPLOYEES_COPY,
};
