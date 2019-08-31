import {Injectable} from "@angular/core";
import  * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import {BehaviorSubject} from "rxjs";

//TODO - Read this code
const moment = extendMoment(Moment);
const start = moment().format('YYYY-MM-DD');
const end = moment().add(7, 'days').format('YYYY-MM-DD');

const TREE_DATA = {
  'name': 'New Project',
  'progress': 0,
  'dates': {
    'start': start,
    'end': end,
  },
  'steps': [{
    'name': 'Step 1',
    'progress': 0,
    'dates': {
      'start': start,
      'end': end
    },
    'steps': [{
      'name': 'Step 1.1',
      'progress': 0,
      'dates': {
        'start': start,
        'end': end
      },
      'steps': []
    }, {
      'name': 'Step 1.2',
      'progress': 0,
      'dates': {
        'start': start,
        'end': end
      },
      'steps': []
    }]
  }, {
    'name': 'Step 2',
    'progress': 0,
    'dates': {
      'start': start,
      'end': end
    },
    'steps': [{
      'name': 'Step 2.1',
      'progress': 0,
      'dates': {
        'start': start,
        'end': end
      },
      'steps': []
    }, {
      'name': 'Step 2.2 lorem Step 2.2 lorem Step 2.2 lorem Step 2.2 lorem  Step 2.2 lorem',
      'progress': 0,
      'dates': {
        'start': start,
        'end': end
      },
      'steps': []
    }]
  }]
};
export class ScheduleStep {
  name: string;
  progress: number;
  progressDates: string[];
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
  get data(): ScheduleStep { return this.dataChange.getValue() };

  constructor(){
    //  TODO
    this.initialize();
    this.dataChange.asObservable().subscribe(val => this.saveStore(val));
  }

  loadStore(){
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveStore(val){
    localStorage.setItem(this.storageKey, JSON.stringify(val));
  }

  initialize(){
    const store = this.loadStore();
    if(store){
      const tree =this.buildTree([store], 0);
      this.dataChange.next(tree[0]);
    } else {
      const tree = this.buildTree([TREE_DATA],0);
      this.dataChange.next(tree[0]);
    }
  }

  private buildTree(steps: Array<any>, level: number) {
    return steps.map((step: ScheduleStep) => {
      const newStep = new ScheduleStep();
      newStep.name = step.name;
      newStep.progress = step.progress;
      newStep.dates = step.dates;
      newStep.expanded = step.expanded !== undefined ? step.expanded : true;

      //Set progress dates
      newStep.progressDates = this.setProgressDates(step);

      if(step.steps !== undefined && step.steps.length){
        newStep.steps = this.buildTree(step.steps,level + 1);
      }
      return newStep;
    });
  }

  private setProgressDates(step: ScheduleStep) {
    //TODO: Study this code
    const start = this.moment(step.dates.start);
    const end = this.moment(step.dates.end);
    const range = moment.range(start, end);

    const numDays = Math.round(Array.from(range.by('days')).length * step.progress / 100); // estimated completed days
    const totalDays = Array.from(range.by('days')).map(d => d.format('YYYY-MM-DD')); // all days in string array
    return totalDays.splice(0, numDays); // start from 0, get the first len days
  }
}
