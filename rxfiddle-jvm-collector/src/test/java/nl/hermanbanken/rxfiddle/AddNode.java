package nl.hermanbanken.rxfiddle;

public class AddNode implements Captured {
    private final long id;
    private final String type;

    public AddNode(long id, String type) {
        this.id = id;
        this.type = type;
    }

    @Override
    public String toString() {
        return "(AddNode) {" +
                "\"id\":\"" + id +
                "\",\"type\":\"" + type + '\"' +
                '}';
    }
}