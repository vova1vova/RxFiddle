package nl.hermanbanken.rxfiddle.js.collector;

import nl.hermanbanken.rxfiddle.js.oct.ITreeLogger;

public class TreePoster implements ITreeLogger {
    @Override
    public void addNode(long id, String type) {
        System.out.println("addNode id:" + id + " type:" + type);
    }

    @Override
    public void addMeta(long id, Object meta) {
        System.out.println("addMeta id:" + id + " with meta:" + meta);
    }

    @Override
    public void addEdge(String v, String w, String type, Object meta) {
        System.out.println("addEdge v:" + v + " w:" + w + " type:" + type + " with meta:" + meta);
    }
}