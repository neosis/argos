import {Injectable} from "@angular/core";
import * as Moment from 'moment';
import {extendMoment} from 'moment-range';
import {BehaviorSubject} from "rxjs";

//TODO - Read this code
const moment = extendMoment(Moment);

export class ScheduleStep {
  name: string;
  progress: number;
  progressMonths: string[];
  dates: {
    start: string;
    end: string;
  };
  steps: ScheduleStep[];
  expanded: boolean;
}

@Injectable()
export class ScheduleDataService {
  storageKey: 'ProjectScheduleData';
  moment = moment;
  dataChange = new BehaviorSubject<ScheduleStep>(null);

  get data(): ScheduleStep {
    return this.dataChange.getValue()
  };

  constructor() {
    //  TODO
    this.initialize();
    this.dataChange.asObservable().subscribe(val => this.saveStore(val));
  }

  loadStore() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveStore(val) {
    localStorage.setItem(this.storageKey, JSON.stringify(val));
  }

  initialize() {
    const store = this.loadStore();
    if (store) {
      const tree = this.buildTree([store], 0);
      this.dataChange.next(tree[0]);
    } else {
      const start = moment().format('YYYY-MM-DD');
      const end = moment().add(180, 'days').format('YYYY-MM-DD');
      const root = {
        'name': 'Project Name',
        'progress': 0,
        'dates': {
          'start': start,
          'end': end,
        },
        'steps': new Array<ScheduleStep>()
      };
      const tree = this.buildTree([root], 0);
      this.dataChange.next(tree[0]);
    }
  }

  private buildTree(steps: Array<any>, level: number): ScheduleStep[] {
    return steps.map((step: ScheduleStep) => {
      const newStep = new ScheduleStep();
      newStep.name = step.name;
      newStep.progress = step.progress;
      newStep.dates = step.dates;
      newStep.expanded = step.expanded !== undefined ? step.expanded : true;

      //Set progress dates
      newStep.progressMonths = this.setProgressMonths(step);

      if (step.steps !== undefined && step.steps.length) {
        newStep.steps = this.buildTree(step.steps, level + 1);
      }
      return newStep;
    });
  }

  updateScheduledStep(node: ScheduleStep, name: string) {
    node.name = name;
    //Dont rebuild tree
    this.saveStore(this.data);
  }

  addScheduledStep(parent: ScheduleStep) {
    parent.expanded = true;
    const child = new ScheduleStep();
    child.name = "New step";
    child.progress = 0;
    child.progressMonths = [];
    child.dates = {
      start: parent.dates.start,
      end: parent.dates.end
    };
    child.steps = [];
    if (parent.steps !== undefined) {
      parent.steps.push(child);
    } else {
      parent.steps = new Array<ScheduleStep>();
      parent.steps.push(child);
    }
    this.dataChange.next(this.data);
    console.log('Child added');
  }

  deleteScheduledStep(parent: ScheduleStep, child: ScheduleStep) {
    const childIndex = parent.steps.indexOf(child);
    parent.steps.splice(childIndex, 1);
    this.dataChange.next(this.data);
    console.log('child deleted');
  }

  toggleExpanded(node: ScheduleStep) {
    node.expanded = !node.expanded;
    this.saveStore(this.data);
    console.log("Toggle data updated");
  }

  setProgressMonths(step: ScheduleStep) {
    const start = moment(step.dates.start);
    const end = moment(step.dates.end);
    const range = moment.range(start, end);

    const noOfMonthsCompleted = Math.round(Array.from(range.by('months')).length * step.progress / 100);
    const totalDays = Array.from(range.by('months')).map(d => d.format("MMM YY"));
    return totalDays.splice(0, noOfMonthsCompleted);
  }

  updateMonthRange(step: ScheduleStep) {
    step.progressMonths = this.setProgressMonths(step);
    this.saveStore(this.data);
    console.log("Updated daterange");
    return step.progressMonths;
  }

  updateProgress(step: ScheduleStep, progress: number) {
    step.progress = progress;
    step.progressMonths = this.setProgressMonths(step);
    this.saveStore(this.data);
    console.log("updated progress");
    return step.progressMonths;
  }
}
