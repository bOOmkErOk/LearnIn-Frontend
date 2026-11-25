import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/user.models';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-teacher-catalog',
  styleUrl: './teacher-catalog.scss',
  templateUrl: './teacher-catalog.html',
})
export class TeacherCatalog implements OnInit {

  private userService = inject(UserService);

  teachers = signal<UserProfile[]>([]);
  searchQuery = signal('');
  loading = signal(true);

  filteredTeachers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.teachers();

    return this.teachers().filter((teacher) =>
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.userService.getTeachers().subscribe({
      next: (data) => {
        this.teachers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
