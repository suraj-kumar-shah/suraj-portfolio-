export interface Subject {
  name: string
  grade: string
  description: string
}

export interface Semester {
  id: number
  name: string
  tgpa: number
  subjects: Subject[]
}

export const semesters: Semester[] = [
  {
    id: 1,
    name: "Semester 1 (Foundation Phase)",
    tgpa: 6.79,
    subjects: [
      { name: "Orientation to Computing-I", grade: "A", description: "Very Good" },
      { name: "Internet Programming Laboratory", grade: "A", description: "Very Good" },
      { name: "Python Programming", grade: "A", description: "Very Good" },
      { name: "Engineering Graphics & Digital Fabrication", grade: "C", description: "Average" },
      { name: "Engineering Mathematics", grade: "A", description: "Very Good" },
      { name: "Soft Skills-I", grade: "B", description: "Average" },
      { name: "Engineering Physics", grade: "C", description: "Average" },
    ]
  },
  {
    id: 2,
    name: "Semester 2 (Core Fundamentals)",
    tgpa: 7.6,
    subjects: [
      { name: "Environmental Studies", grade: "B", description: "Average" },
      { name: "Computer Programming", grade: "A", description: "Good" },
      { name: "Orientation to Computing-II", grade: "A", description: "Good" },
      { name: "Software Engineering", grade: "A", description: "Good" },
      { name: "Basic Electrical & Electronics Engineering", grade: "B", description: "Average" },
      { name: "Electrical & Electronics Lab", grade: "C", description: "Average" },
      { name: "Database Management System", grade: "B", description: "Average" },
      { name: "Discrete Mathematics", grade: "B", description: "Average" },
      { name: "Communication Skills-I", grade: "B", description: "Average" },
    ]
  },
  {
    id: 3,
    name: "Semester 3 (Technical Growth)",
    tgpa: 7.3,
    subjects: [
      { name: "Object-Oriented Programming", grade: "A+", description: "Excellent" },
      { name: "Data Structures & Design", grade: "A+", description: "Excellent" },
      { name: "Computer Organization & Design", grade: "B", description: "Average" },
      { name: "Computer Networks", grade: "A", description: "Good" },
      { name: "Operating Systems", grade: "A", description: "Good" },
      { name: "Operating Systems Lab", grade: "A", description: "Good" },
      { name: "Community Development Project", grade: "C", description: "Average" },
      { name: "Communication Skills-II", grade: "B", description: "Average" },
    ]
  },
  {
    id: 4,
    name: "Semester 4 (Advanced & Specialization)",
    tgpa: 8.08,
    subjects: [
      { name: "Programming in Java", grade: "A", description: "Good" },
      { name: "Design & Analysis of Algorithms", grade: "A", description: "Good" },
      { name: "Managing Cloud Solutions", grade: "A+", description: "Excellent" },
      { name: "Cloud Architecture & Implementation", grade: "A+", description: "Excellent" },
      { name: "Artificial Intelligence Essentials", grade: "A+", description: "Excellent" },
      { name: "Probability & Statistics", grade: "B", description: "Average" },
      { name: "Analytical Skills", grade: "A", description: "Good" },
    ]
  }
]