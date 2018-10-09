import { EdgeType, ISchedulerInfo, ITreeLogger, NodeType } from "../oct/oct"
import { treeLog } from "../collector/logger";

export default class TreePoster implements ITreeLogger {
  private post: (message: any) => void
  constructor(cb?: (message: any) => void) {
    if (typeof cb === "function") {
      this.post = cb
    } else if (typeof window === "object" && window.parent) {
      this.post = m => window.parent.postMessage(m, window.location.origin)
    } else {
      this.post = m => { /* intentionally left blank */ }
      console.error("Using Window.postMessage logger in non-browser environment", new Error())
    }
  }
  public addNode(id: string, type: NodeType, scheduler?: ISchedulerInfo): void {
    treeLog(id, "addNode id:" + id + " type:" + type + " scheduler:" + scheduler)
    this.post({ id, type, scheduler })
  }
  public addMeta(id: string, meta: any): void {
    treeLog(id, "addMeta id:" + id + " meta:" + JSON.stringify(meta))
    this.post({ id, meta })
  }
  public addEdge(v: string, w: string, type: EdgeType, meta?: any): void {
    this.post({ v, w, type, meta })
  }
  public addScheduler(id: string, scheduler: ISchedulerInfo): void {
    treeLog(id, "addScheduler id:" + id + " scheduler:" + scheduler)
    this.post({ id, scheduler })
  }
  public addContraction(id: string, nodes: string[]): void {
    treeLog(id, "addContraction id:" + id + " nodes:" + nodes)
    this.post({ id, contract: nodes })
  }

  public reset() {
    this.post("reset")
  }
}
