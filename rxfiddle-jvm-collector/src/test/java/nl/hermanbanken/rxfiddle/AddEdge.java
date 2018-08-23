package nl.hermanbanken.rxfiddle;

public class AddEdge implements Captured {
    private final String v;
    private final String w;
    private final String type;
    private final Object meta;

    public AddEdge(String v, String w, String type, Object meta) {
        this.v = v;
        this.w = w;
        this.type = type;
        this.meta = meta;
    }
}