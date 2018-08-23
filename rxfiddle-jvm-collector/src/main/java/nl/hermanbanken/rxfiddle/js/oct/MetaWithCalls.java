package nl.hermanbanken.rxfiddle.js.oct;

public class MetaWithCalls {
    //todo is should be object here to match JS collector
    private final String calls;

    public MetaWithCalls(String calls) {
        this.calls = calls;
    }

    @Override
    public String toString() {
        return "{" +
                "\"calls\":\"" + calls + '\"' +
                '}';
    }
}