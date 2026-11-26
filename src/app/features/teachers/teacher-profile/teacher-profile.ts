import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/user.models';
import { CourseState } from '../../../store/course/course.state';
import { AuthState } from '../../../store/auth/auth.state';
import { SubscriptionState } from '../../../store/subscribtions/subscription.state';
import { LoadCourses } from '../../../store/course/course.actions';
import { CreateSubscription, LoadMySubscriptions } from '../../../store/subscribtions/subscribtion.actions';

@Component({
  imports: [RouterLink],
  selector: 'app-teacher-profile',
  styleUrl: './teacher-profile.scss',
  templateUrl: './teacher-profile.html',
})
export class TeacherProfile implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  teacherId = signal<number>(0);
  teacher = signal<UserProfile | null>(null);
  loadingTeacher = signal(true);
  subscribing = signal(false);

  allCourses = this.store.selectSignal(CourseState.courses);
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);
  currentUser = this.store.selectSignal(AuthState.currentUser);
  subscriptions = this.store.selectSignal(SubscriptionState.subscriptions);

  teacherCourses = computed(() =>
    this.allCourses().filter((c) => c.teacherId === this.teacherId())
  );

  isSubscribed = computed(() => {
    const id = this.teacherId();
    if (!id) return false;
    if (this.currentUser().id === id) return true;

    return this.subscriptions().some(
      (sub) => sub.teacherId === id && sub.isCurrentlyActive
    );
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.teacherId.set(id);

    this.store.dispatch(new LoadCourses());
    if (this.isAuthenticated()) {
      this.store.dispatch(new LoadMySubscriptions());
    }

    this.userService.getTeachers().subscribe({
      next: (teachers) => {
        const found = teachers.find((t) => t.id === id) ?? null;
        this.teacher.set(found);
        this.loadingTeacher.set(false);
      },
      error: () => {
        this.loadingTeacher.set(false);
      }
    });
  }

  onSubscribe(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.subscribing.set(true);
    this.store
      .dispatch(
        new CreateSubscription({
          teacherId: this.teacherId(),
          durationMonths: 1,
          pricePaid: 19.99
        })
      )
      .subscribe({
        next: () => {
          this.subscribing.set(false);
          this.store.dispatch(new LoadMySubscriptions());
        },
        error: () => {
          this.subscribing.set(false);
        }
      });
  }
}
