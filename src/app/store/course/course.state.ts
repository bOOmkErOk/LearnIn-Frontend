import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Course, Lesson } from "../../core/models/course.models";
import { inject, Injectable } from "@angular/core";
import { CourseService } from "../../core/services/course.service";
import { CreateCourse, DeleteCourse, UpdateCourse } from "./course.actions";
import { tap } from "rxjs";

export interface CourseStateModel {
  courses: Course[];
  selectedCourse: Course | null;
  selectedCourseLessons: Lesson[];
  loading: boolean;
}

@State<CourseStateModel>({
  name: 'courses',
  defaults: {
    courses: [],
    selectedCourse: null,
    selectedCourseLessons: [],
    loading: false
  }
})

@Injectable()
export class CourseState {

  private courseService = inject(CourseService);

  // --- Selectors ---
  @Selector()
  static courses(state: CourseStateModel): Course[] {
    return state.courses;
  }

  @Selector()
  static selectedCourse(state: CourseStateModel): Course | null {
    return state.selectedCourse;
  }

  @Selector()
  static selectedCourseLessons(state: CourseStateModel): Lesson[] {
    return state.selectedCourseLessons;
  }

  @Selector()
  static loading(state: CourseStateModel): boolean {
    return state.loading;
  }

  // --- Mutation Actions ---
  @Action(CreateCourse)
  createCourse(ctx: StateContext<CourseStateModel>, action: CreateCourse) {
    ctx.patchState({ loading: true });
    return this.courseService.createCourse(action.payload).pipe(
      tap({
        next: () => ctx.patchState({ loading: false }),
        error: () => ctx.patchState({ loading: false })
      })
    );
  }

  @Action(UpdateCourse)
  updateCourse(ctx: StateContext<CourseStateModel>, action: UpdateCourse) {
    ctx.patchState({ loading: true });
    return this.courseService.updateCourse(action.id, action.payload).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const updatedCourses = state.courses.map((course) =>
            course.id === action.id ? { ...course, ...action.payload } : course
          );
          ctx.patchState({ courses: updatedCourses, loading: false });
        },
        error: () => ctx.patchState({ loading: false })
      })
    );
  }

  @Action(DeleteCourse)
  deleteCourse(ctx: StateContext<CourseStateModel>, action: DeleteCourse) {
    ctx.patchState({ loading: true });
    return this.courseService.deleteCourse(action.id).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          const filteredCourses = state.courses.filter((c) => c.id !== action.id);
          ctx.patchState({ courses: filteredCourses, loading: false });
        },
        error: () => ctx.patchState({ loading: false })
      })
    );
  }

  @Action(LoadCourses)
  loadCourses(ctx: StateContext<CourseStateModel>) {
    ctx.patchState({ loading: true });
    return this.courseService.getCourses().pipe(
      tap({
        next: (courses) => ctx.patchState({ courses, loading: false }),
        error: () => ctx.patchState({ loading: false })
      })
    );
  }
}