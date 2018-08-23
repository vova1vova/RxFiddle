package nl.hermanbanken.rxfiddle.js.oct;

public interface ITreeLogger {
//    export type Id = string
//                     O->O *-*    | O->S 1-1            | S->S *-*
//    export type EdgeType = "addSource" | "setObserverSource" | "addObserverDestination" | "addObserverOuter"
//    export type NodeType = "observable" | "subject" | "observer"

//    addNode(id: Id, type: NodeType, timing?: ISchedulerInfo): void
//    addMeta(id: Id, meta: any): void
//    addEdge(v: Id, w: Id, type: EdgeType, meta?: any): void
//    addScheduler(id: Id, scheduler: ISchedulerInfo): void
//    addContraction(id: Id, nodes: Id[]): void

    void addNode(long id, String type);
    void addMeta(long id, Object meta);
    void addEdge(String v, String w, String type, Object meta);
}