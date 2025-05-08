import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    recordedCourses: [],
    liveCourses: [],
    currentCourse: null,
    currentLesson: null
  }),
  actions: {
    setRecordedCourses(courses) {
      this.recordedCourses = courses
    },
    setLiveCourses(courses) {
      this.liveCourses = courses
    },
    setCurrentCourse(course) {
      this.currentCourse = course
    },
    setCurrentLesson(lesson) {
      this.currentLesson = lesson
    }
  }
}) 