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
  ){}
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
  treeControl: FlatTreeControl<ScheduleStepFlat>;
  treeFlattner: MatTreeFlattener<ScheduleStep, ScheduleStepFlat>;
  dataSource: MatTreeFlatDataSource<ScheduleStep, ScheduleStepFlat>;
  projectScheduleData: any;

  constructor(private scheduleDataService: ScheduleDataService) {
    this.treeFlattner = new MatTreeFlattener<ScheduleStep, ScheduleStepFlat>(
      this.transformer, this._getLevel, this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<ScheduleStepFlat>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource<ScheduleStep, ScheduleStepFlat>(this.treeControl, this.treeFlattner);
    this.scheduleDataService.dataChange.subscribe((tree: ScheduleStep) => {
      if(tree){
        this.projectScheduleData = [tree];
        this.dataSource.data = [tree];

        this.treeControl.dataNodes.forEach(node => {
          if(node.expanded){
            this.treeControl.expand(node);
          } else {
            this.treeControl.collapse(node);
          }
        });
        console.log(tree);
      }else {
        console.log("No data");
      }
    });
  }

  ngOnInit() {
  }

  private transformer(node: ScheduleStep, level: number) {
    const flatNode = new ScheduleStepFlat(
      node.steps !== undefined?  true : false, level, node.name, node.progress, node.progressDates, node.dates, node.expanded
    );
    return flatNode;
  }
  private _getLevel = (node: ScheduleStepFlat) => node.level;
  private _isExpandable = (node: ScheduleStepFlat) => node.expandable;
  private _getChildren = (node: ScheduleStep): Observable<ScheduleStep[]> => of(node.steps);
  hasChild = (_: number, _nodeData: ScheduleStepFlat) => _nodeData.expandable;
  restrictMove: boolean = false;

  log(x) {
    console.log('dragEnd ', x.sizes, ' total > ', x.sizes.reduce((t, s) => t+s, 0))
  }
}
