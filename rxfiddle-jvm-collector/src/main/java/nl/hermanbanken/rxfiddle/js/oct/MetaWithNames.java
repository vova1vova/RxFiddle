package nl.hermanbanken.rxfiddle.js.oct;

public class MetaWithNames {
    private final String names;

    public MetaWithNames(String names) {
        this.names = names;
    }

    @Override
    public String toString() {
        return "{" +
                "\"names\":\"" + names + '\"' +
                '}';
    }
}