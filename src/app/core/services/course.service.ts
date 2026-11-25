import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../enviroments/enviroment";
import { AddLessonRequest, Course, CreateCourseRequest } from "../models/course.models";
import { map, Observable } from "rxjs";
import { Apollo, gql } from "apollo-angular";

@Injectable({
    providedIn: 'root'
})

export class CourseService {

    private http = inject(HttpClient);
    private apollo = inject(Apollo);
    private coursesUrl = `${environment.apiUrl}/courses`;
    private lessonsUrl = `${environment.apiUrl}/lessons`;

    addLesson(request: AddLessonRequest): Observable<number> {
        return this.http.post<number>(`${this.lessonsUrl}/addLesson`, request);
    }

    updateLesson(id: number, request: AddLessonRequest): Observable<number> {
        return this.http.put<number>(`${this.lessonsUrl}/${id}`, request);
    }

    deleteLesson(id: number): Observable<number> {
        return this.http.delete<number>(`${this.lessonsUrl}/${id}`);
    }

    createCourse(request: CreateCourseRequest): Observable<number> {
        return this.http.post<number>(`${this.coursesUrl}/createCourse`, request);
    }

    updateCourse(id: number, request: CreateCourseRequest): Observable<number> {
        return this.http.put<number>(`${this.coursesUrl}/${id}`, request);
    }

    deleteCourse(id: number): Observable<number> {
        return this.http.delete<number>(`${this.coursesUrl}/${id}`);
    }

    getCourses(): Observable<Course[]> {
        return this.apollo
            .query<{ courses: Course[] }>({
                query: gql`
        query GetCourses {
          courses {
            id
            title
            description
            promoVideoUrl
            teacherId
            totalLessons
            totalDurationSeconds
          }
        }
      `,
                fetchPolicy: 'network-only'
            })
            .pipe(map((result) => result.data!.courses));
    }

    getCourseById(id: number): Observable<Course> {
        return this.apollo
            .query<{ courseById: Course }>({
                query: gql`
          query GetCourseById($id: Int!) {
            courseById(id: $id) {
              id
              title
              description
              promoVideoUrl
              teacherId
              totalLessons
              totalDurationSeconds
            }
          }
        `,
                variables: { id },
                fetchPolicy: 'network-only'
            })
            .pipe(map((result) => result.data!.courseById));
    }

}