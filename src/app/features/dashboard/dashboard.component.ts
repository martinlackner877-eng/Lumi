import { Component, computed, signal } from '@angular/core';

type OrbitalRing = {
  label: string;
  value: number;
  total: number;
  radius: number;
  circumference: number;
  offset: number;
  color: string;
  glow: string;
};

type EventHorizonItem = {
  title: string;
  course: string;
  kind: 'Exam' | 'Deadline';
  dateLabel: string;
  daysUntil: number;
  location: string;
};

type SemesterNode = {
  type: 'VO' | 'UE' | 'SE';
  title: string;
  professor: string;
  cadence: string;
};

type ParallelDimension = {
  key: 'infineon' | 'fitness';
  title: string;
  tagline: string;
  status: string;
  entries: string[];
};

type ThesisVault = {
  stage: string;
  focus: string;
  nextMilestone: string;
  syncWindow: string;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly progress = signal({
    ects: 126,
    ectsTarget: 180,
    semester: 6,
    semesterTarget: 8,
    thesis: 42,
    thesisTarget: 100,
    completedModules: 29,
  });

  readonly eventHorizon = signal<EventHorizonItem[]>([
    {
      title: 'Distributed Systems Exam',
      course: 'SE Distributed Systems',
      kind: 'Exam',
      dateLabel: '24 Mar 2026',
      daysUntil: 5,
      location: 'EI 7, Hörsaal 2',
    },
    {
      title: 'Machine Learning Deadline',
      course: 'VO Machine Learning',
      kind: 'Deadline',
      dateLabel: '26 Mar 2026',
      daysUntil: 7,
      location: 'Submission Portal',
    },
    {
      title: 'Security Lab Checkpoint',
      course: 'UE IT Security',
      kind: 'Deadline',
      dateLabel: '30 Mar 2026',
      daysUntil: 11,
      location: 'Lab Cluster',
    },
  ]);

  readonly semesterNodes = signal<SemesterNode[]>([
    {
      type: 'VO',
      title: 'Machine Learning',
      professor: 'Prof. Dr. Elena Voss',
      cadence: 'Tue, 10:15',
    },
    {
      type: 'UE',
      title: 'IT Security Lab',
      professor: 'Univ.-Ass. Markus Stein',
      cadence: 'Wed, 14:00',
    },
    {
      type: 'SE',
      title: 'Distributed Systems Seminar',
      professor: 'Prof. Dr. Tobias Kern',
      cadence: 'Thu, 08:30',
    },
    {
      type: 'VO',
      title: 'Advanced HCI',
      professor: 'Prof. Dr. Jana Klee',
      cadence: 'Fri, 12:00',
    },
  ]);

  readonly parallelDimensions = signal<ParallelDimension[]>([
    {
      key: 'infineon',
      title: 'Infineon',
      tagline: 'Tech-Focus',
      status: '3 live tasks',
      entries: [
        'Finalize sensor dashboard review',
        'Prepare sync notes for firmware handoff',
        'Clean up automation script findings',
      ],
    },
    {
      key: 'fitness',
      title: 'Fitness',
      tagline: 'Energy-Focus',
      status: '2 sessions queued',
      entries: [
        'Leg day on Monday, 18:30',
        'Push session on Thursday, 19:00',
        'Mobility reset after campus block',
      ],
    },
  ]);

  readonly thesisVault = signal<ThesisVault>({
    stage: 'Topic calibration',
    focus: 'Adaptive knowledge systems for student workflows',
    nextMilestone: 'Research outline locked in 9 days',
    syncWindow: 'Supervisor sync on 31 Mar 2026',
  });

  readonly orbitalRings = computed<OrbitalRing[]>(() => {
    const current = this.progress();

    return [
      this.createRing('ECTS', current.ects, current.ectsTarget, 112, '#00F0FF', '#00F0FF'),
      this.createRing(
        'Semester',
        current.semester,
        current.semesterTarget,
        89,
        '#8A2BE2',
        '#8A2BE2',
      ),
      this.createRing('Thesis', current.thesis, current.thesisTarget, 66, '#74F9FF', '#C06BFF'),
    ];
  });

  readonly ectsPercent = computed(() => {
    const { ects, ectsTarget } = this.progress();
    return Math.round((ects / ectsTarget) * 100);
  });

  readonly activeAlertCount = computed(() =>
    this.eventHorizon().filter((item) => item.daysUntil <= 7).length,
  );

  readonly pulseWindow = computed(() => {
    const nextCritical = this.eventHorizon()
      .filter((item) => item.daysUntil >= 3 && item.daysUntil <= 7)
      .map((item) => `${item.title} in T-${item.daysUntil}`)
      .join(' • ');

    return nextCritical || 'No pulsing deadlines in the next 7 days';
  });

  protected isPulseWindow(daysUntil: number): boolean {
    return daysUntil >= 3 && daysUntil <= 7;
  }

  protected isCriticalWindow(daysUntil: number): boolean {
    return daysUntil < 3;
  }

  private createRing(
    label: string,
    value: number,
    total: number,
    radius: number,
    color: string,
    glowColor: string,
  ): OrbitalRing {
    const circumference = 2 * Math.PI * radius;
    const ratio = Math.min(Math.max(value / total, 0), 1);

    return {
      label,
      value,
      total,
      radius,
      circumference,
      offset: circumference * (1 - ratio),
      color,
      glow: `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 22px ${glowColor}55)`,
    };
  }
}
