import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { CourseState } from '../../store/course/course.state';
import { LoadCourses } from '../../store/course/course.actions';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {

  private store = inject(Store);

  courses = this.store.selectSignal(CourseState.courses);
  loading = this.store.selectSignal(CourseState.loading);

  ngOnInit(): void {
    this.store.dispatch(new LoadCourses());
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }
}
