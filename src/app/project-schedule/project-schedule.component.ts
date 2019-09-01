import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ScheduleDataService, ScheduleStep} from "../service/schedule-data.service";
import * as Moment from 'moment';
import {extendMoment} from "moment-range";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material";
import {Observable, of} from "rxjs";

const moment = extendMoment(Moment);

export class ScheduleStepFlat {
  constructor(
    public expandable: boolean, public level: number,
    public name: string, public progress: number,
    public progressDates: string[],
    public dates: {
      start: string;
      end: string;
    },
    public expanded: boolean
  ) {
  }
}

@Component({
  selector: 'app-project-schedule',
  templateUrl: './project-schedule.component.html',
  styleUrls: ['./project-schedule.component.scss'],
  providers: [ScheduleDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectScheduleComponent implements OnInit {
  moment = moment;
  months: String[] = [];
  today = moment().format("YYYY-MM-DD");
  treeControl: FlatTreeControl<ScheduleStepFlat>;
  treeFlattner: MatTreeFlattener<ScheduleStep, ScheduleStepFlat>;
  dataSource: MatTreeFlatDataSource<ScheduleStep, ScheduleStepFlat>;
  projectScheduleData: any;
  flatNodeMap: Map<ScheduleStepFlat, ScheduleStep>;

  // nestedNodeMap: Map<ScheduleStep, ScheduleStepFlat> = new Map<ScheduleStep, ScheduleStepFlat>();

  constructor(private scheduleDataService: ScheduleDataService) {
    this.flatNodeMap = new Map<ScheduleStepFlat, ScheduleStep>();
    this.treeFlattner = new MatTreeFlattener<ScheduleStep, ScheduleStepFlat>(
      this.transformer, this._getLevel, this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<ScheduleStepFlat>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource<ScheduleStep, ScheduleStepFlat>(this.treeControl, this.treeFlattner);
    this.scheduleDataService.dataChange.subscribe((tree: ScheduleStep) => {
      if (tree) {
        this.projectScheduleData = [tree];
        this.dataSource.data = [tree];
        this.buildCalendar(tree);

        this.treeControl.dataNodes.forEach(node => {
          if (node.expanded) {
            this.treeControl.expand(node);
          } else {
            this.treeControl.collapse(node);
          }
        });
        console.log(tree);
      } else {
        console.log("No data");
      }
    });
  }

  ngOnInit() {
  }

  transformer = (node: ScheduleStep, level: number) => {
    const flatNode = new ScheduleStepFlat(
      node.steps !== undefined, level, node.name, node.progress, node.progressDates, node.dates, node.expanded
    );
    this.flatNodeMap.set(flatNode, node);
    // this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  private _getLevel = (node: ScheduleStepFlat) => node.level;
  private _isExpandable = (node: ScheduleStepFlat) => node.expandable;
  private _getChildren = (node: ScheduleStep): Observable<ScheduleStep[]> => of(node.steps);
  hasChild = (_: number, _nodeData: ScheduleStepFlat) => _nodeData.expandable;
  restrictMove: boolean = false;
  currentMonth = moment().format("MMM YY");

  static log(x) {
    console.log('dragEnd ', x.sizes, ' total > ', x.sizes.reduce((t, s) => t + s, 0))
  }

  updateStpeName(node: ScheduleStepFlat, name: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.scheduleDataService.updateScheduledStep(nestedNode, name);
  }

  addChildStep(node: ScheduleStepFlat) {
    const nestedNode = this.flatNodeMap.get(node);
    this.scheduleDataService.addScheduledStep(nestedNode);
  }

  deleteStep(node: ScheduleStepFlat) {
    if (this.treeControl.getLevel(node) < 1) {
      return null;
    }

    const parentFlatNode: ScheduleStepFlat = this.getParentFlatStep(node);
    const parentNode: ScheduleStep = this.flatNodeMap.get(parentFlatNode);
    const childNode: ScheduleStep = this.flatNodeMap.get(node);
    this.scheduleDataService.deleteScheduledStep(parentNode, childNode);
  }

  getParentFlatStep(node: ScheduleStepFlat): ScheduleStepFlat {
    const {treeControl} = this;
    const currentLevel = treeControl.getLevel(node);
    // if root, ignore
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = treeControl.dataNodes.indexOf(node) - 1;
    // loop back to find the nearest upper node
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];
      if (treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }

  toggleExpanded(node: ScheduleStepFlat) {
    const scheduledStepNode: ScheduleStep = this.flatNodeMap.get(node);
    this.scheduleDataService.toggleExpanded(scheduledStepNode);
  }

  buildCalendar(step: ScheduleStep) {
    const start = this.moment(step.dates.start);
    const end = this.moment(step.dates.end);
    const range = this.moment.range(start, end);

    const days = Array.from(range.by('days'));
    const formattedMonths = days.map(d => d.format('MMM YY'));
    this.months = formattedMonths.filter(ProjectScheduleComponent.onlyUnique);
    console.log(this.months);
  }

  static onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
