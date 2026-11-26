import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { CourseState } from '../../../store/course/course.state';
import { AuthState } from '../../../store/auth/auth.state';
import { LoadCourseById, LoadCourseLessons } from '../../../store/course/course.actions';
import { SubscriptionState } from '../../../store/subscribtions/subscription.state';
import { LoadMySubscriptions } from '../../../store/subscribtions/subscribtion.actions';

@Component({
  imports: [],
  selector: 'app-course-details',
  styleUrl: './course-details.scss',
  templateUrl: './course-details.html',
})
export class CourseDetails implements OnInit {

  private store = inject(Store);
  private route = inject(ActivatedRoute);

  course = this.store.selectSignal(CourseState.selectedCourse);
  lessons = this.store.selectSignal(CourseState.selectedCourseLessons);
  loading = this.store.selectSignal(CourseState.loading);
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);
  currentUser = this.store.selectSignal(AuthState.currentUser);
  subscriptions = this.store.selectSignal(SubscriptionState.subscriptions);

  isSubscribed = computed(() => {
    const currentCourse = this.course();
    if (!currentCourse) return false;

    if (this.currentUser().id === currentCourse.teacherId) return true;

    return this.subscriptions().some(
      (sub) => sub.teacherId === currentCourse.teacherId && sub.isCurrentlyActive
    );
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.store.dispatch([new LoadCourseById(id), new LoadCourseLessons(id)]);
    if (this.isAuthenticated()) {
      this.store.dispatch(new LoadMySubscriptions());
    }
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '0m';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
