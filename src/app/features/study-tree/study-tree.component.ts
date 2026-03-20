import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
  viewChild,
} from '@angular/core';
import type { Edge, Network, Node, Options } from 'vis-network/standalone';

type StudyNodeState = 'completed' | 'current' | 'future';

type StudyNodeDefinition = {
  id: string;
  label: string;
  ects: number;
  professor: string;
  state: StudyNodeState;
  x: number;
  y: number;
};

type StudyEdgeDefinition = {
  from: string;
  to: string;
};

@Component({
  selector: 'app-study-tree',
  standalone: true,
  templateUrl: './study-tree.component.html',
  styleUrl: './study-tree.component.scss',
})
export class StudyTreeComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly networkContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('networkContainer');

  private network?: Network;
  private resizeObserver?: ResizeObserver;

  private readonly nodeDefinitions: StudyNodeDefinition[] = [
    {
      id: 'math-1',
      label: 'Mathe 1',
      ects: 5,
      professor: 'Prof. Dr. Clara Weiss',
      state: 'completed',
      x: -980,
      y: -260,
    },
    {
      id: 'programming-1',
      label: 'Programming 1',
      ects: 6,
      professor: 'Univ.-Ass. David Kern',
      state: 'completed',
      x: -980,
      y: 20,
    },
    {
      id: 'discrete-math',
      label: 'Diskrete Mathematik',
      ects: 5,
      professor: 'Prof. Dr. Julia Brandt',
      state: 'completed',
      x: -980,
      y: 300,
    },
    {
      id: 'math-2',
      label: 'Mathe 2',
      ects: 5,
      professor: 'Prof. Dr. Adrian Kern',
      state: 'completed',
      x: -540,
      y: -260,
    },
    {
      id: 'data-structures',
      label: 'Data Structures',
      ects: 5,
      professor: 'Prof. Dr. Leon Adler',
      state: 'completed',
      x: -540,
      y: 20,
    },
    {
      id: 'logic-design',
      label: 'Logic Design',
      ects: 5,
      professor: 'Prof. Dr. Sofia Kern',
      state: 'completed',
      x: -540,
      y: 300,
    },
    {
      id: 'algorithms',
      label: 'Algorithmen',
      ects: 6,
      professor: 'Prof. Dr. Mira Stein',
      state: 'current',
      x: -80,
      y: -220,
    },
    {
      id: 'databases',
      label: 'Datenbanken',
      ects: 5,
      professor: 'Prof. Dr. Mara Lind',
      state: 'current',
      x: -80,
      y: 60,
    },
    {
      id: 'computer-networks',
      label: 'Computer Networks',
      ects: 5,
      professor: 'Prof. Dr. Tarek Osman',
      state: 'current',
      x: -80,
      y: 340,
    },
    {
      id: 'it-security',
      label: 'IT Security',
      ects: 5,
      professor: 'Prof. Dr. Nora Kepler',
      state: 'future',
      x: 420,
      y: -320,
    },
    {
      id: 'distributed-systems',
      label: 'Distributed Systems',
      ects: 6,
      professor: 'Prof. Dr. Jonas Mertens',
      state: 'future',
      x: 420,
      y: -40,
    },
    {
      id: 'machine-learning',
      label: 'Machine Learning',
      ects: 5,
      professor: 'Prof. Dr. Elena Voss',
      state: 'future',
      x: 420,
      y: 240,
    },
    {
      id: 'hci',
      label: 'Advanced HCI',
      ects: 5,
      professor: 'Prof. Dr. Jana Klee',
      state: 'future',
      x: 420,
      y: 520,
    },
    {
      id: 'research-seminar',
      label: 'Research Seminar',
      ects: 4,
      professor: 'Prof. Dr. Tobias Kern',
      state: 'future',
      x: 920,
      y: 40,
    },
    {
      id: 'bachelor-thesis',
      label: 'Bachelorarbeit',
      ects: 12,
      professor: 'Supervisor Node',
      state: 'future',
      x: 1380,
      y: 40,
    },
  ];

  private readonly edgeDefinitions: StudyEdgeDefinition[] = [
    { from: 'math-1', to: 'math-2' },
    { from: 'programming-1', to: 'data-structures' },
    { from: 'discrete-math', to: 'logic-design' },
    { from: 'math-2', to: 'algorithms' },
    { from: 'data-structures', to: 'algorithms' },
    { from: 'programming-1', to: 'databases' },
    { from: 'data-structures', to: 'computer-networks' },
    { from: 'logic-design', to: 'computer-networks' },
    { from: 'algorithms', to: 'it-security' },
    { from: 'algorithms', to: 'machine-learning' },
    { from: 'computer-networks', to: 'distributed-systems' },
    { from: 'databases', to: 'distributed-systems' },
    { from: 'databases', to: 'hci' },
    { from: 'machine-learning', to: 'research-seminar' },
    { from: 'it-security', to: 'research-seminar' },
    { from: 'distributed-systems', to: 'research-seminar' },
    { from: 'research-seminar', to: 'bachelor-thesis' },
    { from: 'distributed-systems', to: 'bachelor-thesis' },
    { from: 'machine-learning', to: 'bachelor-thesis' },
  ];

  private readonly nodeStateById = new Map(
    this.nodeDefinitions.map((node) => [node.id, node.state] as const),
  );

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const [{ Network }, { DataSet }] = await Promise.all([
      import('vis-network/standalone'),
      import('vis-data'),
    ]);

    this.network = new Network(
      this.networkContainer().nativeElement,
      {
        nodes: new DataSet<Node>(this.createNodes()),
        edges: new DataSet<Edge>(this.createEdges()),
      },
      this.createOptions(),
    );

    this.syncNetworkSize();
    this.resizeObserver = new ResizeObserver(() => {
      this.syncNetworkSize();
    });
    this.resizeObserver.observe(this.networkContainer().nativeElement);

    requestAnimationFrame(() => {
      window.setTimeout(() => {
        this.network?.fit({
          maxZoomLevel: 0.8,
          animation: {
            duration: 700,
            easingFunction: 'easeInOutQuad',
          },
        });
      }, 60);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.network?.destroy();
  }

  private createNodes(): Node[] {
    return this.nodeDefinitions.map((node) => ({
      id: node.id,
      label: node.label,
      title: this.createTooltipElement(node),
      group: node.state,
      x: node.x,
      y: node.y,
      fixed: {
        x: true,
        y: true,
      },
      mass: 1.1,
    }));
  }

  private createEdges(): Edge[] {
    return this.edgeDefinitions.map((edge) => {
      const state = this.resolveEdgeState(edge.from, edge.to);
      const tone =
        state === 'completed'
          ? '#00F0FF'
          : state === 'current'
            ? '#8A2BE2'
            : '#314154';

      return {
        from: edge.from,
        to: edge.to,
        width: state === 'future' ? 1 : 1.35,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.42,
            type: 'arrow',
          },
        },
        color: {
          color: `${tone}55`,
          highlight: `${tone}BB`,
          hover: `${tone}DD`,
          inherit: false,
        },
        shadow: {
          enabled: true,
          color: `${tone}66`,
          size: state === 'future' ? 12 : 20,
          x: 0,
          y: 0,
        },
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          forceDirection: 'horizontal',
          roundness: 0.42,
        },
      };
    });
  }

  private createOptions(): Options {
    return {
      autoResize: true,
      width: '100%',
      height: '100%',
      layout: {
        improvedLayout: false,
        randomSeed: 17,
      },
      physics: false,
      nodes: {
        shape: 'dot',
        size: 36,
        borderWidth: 2.4,
        borderWidthSelected: 3,
        font: {
          color: '#FFFFFF',
          face: 'JetBrains Mono, monospace',
          size: 20,
          strokeWidth: 0,
        },
        color: {
          background: '#05050A',
          border: '#00F0FF',
          highlight: {
            background: '#05050A',
            border: '#8A2BE2',
          },
          hover: {
            background: '#05050A',
            border: '#00F0FF',
          },
        },
        shadow: {
          enabled: true,
          color: '#00F0FFAA',
          size: 40,
          x: 0,
          y: 0,
        },
        chosen: {
          node: (values, id, selected, hovered) => {
            const state = this.nodeStateById.get(String(id)) ?? 'future';
            const intensified = hovered || selected;

            values.shadow = true;
            values.shadowX = 0;
            values.shadowY = 0;

            if (state === 'completed') {
              values.borderColor = intensified ? '#8A2BE2' : '#00F0FF';
              values.shadowColor = intensified ? '#8A2BE2CC' : '#00F0FFCC';
              values.shadowSize = intensified ? 56 : 42;
              values.borderWidth = intensified ? 3.4 : 2.4;
              values.size = intensified ? 42 : 36;
              values.color = '#05050A';
              return;
            }

            if (state === 'current') {
              values.borderColor = '#8A2BE2';
              values.shadowColor = intensified ? '#D2A6FF' : '#8A2BE2CC';
              values.shadowSize = intensified ? 62 : 48;
              values.borderWidth = intensified ? 3.8 : 3;
              values.size = intensified ? 45 : 38;
              values.color = '#05050A';
              return;
            }

            values.borderColor = intensified ? '#8A2BE2' : '#263142';
            values.shadowColor = intensified ? '#00F0FF88' : '#101925';
            values.shadowSize = intensified ? 36 : 18;
            values.borderWidth = intensified ? 2.8 : 1.5;
            values.size = intensified ? 40 : 32;
            values.color = '#05050A';
          },
          label: false,
        },
      },
      groups: {
        completed: {
          color: {
            background: '#05050A',
            border: '#00F0FF',
            highlight: {
              background: '#05050A',
              border: '#00F0FF',
            },
            hover: {
              background: '#05050A',
              border: '#8A2BE2',
            },
          },
          shadow: {
            enabled: true,
            color: '#00F0FFB3',
            size: 42,
            x: 0,
            y: 0,
          },
          size: 36,
          borderWidth: 2.4,
        },
        current: {
          color: {
            background: '#05050A',
            border: '#8A2BE2',
            highlight: {
              background: '#05050A',
              border: '#8A2BE2',
            },
            hover: {
              background: '#05050A',
              border: '#D2A6FF',
            },
          },
          shadow: {
            enabled: true,
            color: '#8A2BE2CC',
            size: 48,
            x: 0,
            y: 0,
          },
          size: 38,
          borderWidth: 3,
        },
        future: {
          color: {
            background: '#05050A',
            border: '#263142',
            highlight: {
              background: '#05050A',
              border: '#00F0FF',
            },
            hover: {
              background: '#05050A',
              border: '#8A2BE2',
            },
          },
          font: {
            color: '#7E8AA0',
            face: 'JetBrains Mono, monospace',
            size: 19,
            strokeWidth: 0,
          },
          shadow: {
            enabled: true,
            color: '#101925',
            size: 16,
            x: 0,
            y: 0,
          },
          size: 32,
          borderWidth: 1.5,
        },
      },
      edges: {
        color: {
          color: '#00F0FF33',
          highlight: '#00F0FF99',
          hover: '#8A2BE299',
          inherit: false,
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.42,
            type: 'arrow',
          },
        },
        width: 1.25,
        hoverWidth: 1.2,
        selectionWidth: 0,
        shadow: {
          enabled: true,
          color: '#00F0FF33',
          size: 22,
          x: 0,
          y: 0,
        },
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          forceDirection: 'horizontal',
          roundness: 0.42,
        },
      },
      interaction: {
        dragView: true,
        zoomView: true,
        dragNodes: false,
        hover: true,
        hoverConnectedEdges: true,
        tooltipDelay: 120,
      },
    };
  }

  private resolveEdgeState(from: string, to: string): StudyNodeState {
    const fromState = this.nodeStateById.get(from) ?? 'future';
    const toState = this.nodeStateById.get(to) ?? 'future';

    if (fromState === 'completed' && toState === 'completed') {
      return 'completed';
    }

    if (fromState === 'current' || toState === 'current') {
      return 'current';
    }

    return 'future';
  }

  private syncNetworkSize(): void {
    const container = this.networkContainer().nativeElement;

    if (!this.network || !container.clientWidth || !container.clientHeight) {
      return;
    }

    this.network.setSize(`${container.clientWidth}px`, `${container.clientHeight}px`);
    this.network.redraw();
  }

  private createTooltipElement(node: StudyNodeDefinition): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'lumi-vis-tooltip';

    const ectsLabel = document.createElement('span');
    ectsLabel.className = 'lumi-vis-tooltip__label';
    ectsLabel.textContent = 'ECTS';

    const ectsValue = document.createElement('strong');
    ectsValue.className = 'lumi-vis-tooltip__value';
    ectsValue.textContent = String(node.ects);

    const professorLabel = document.createElement('span');
    professorLabel.className = 'lumi-vis-tooltip__label';
    professorLabel.textContent = 'Prof';

    const professorValue = document.createElement('strong');
    professorValue.className = 'lumi-vis-tooltip__value';
    professorValue.textContent = node.professor;

    wrapper.append(ectsLabel, ectsValue, professorLabel, professorValue);

    return wrapper;
  }
}
