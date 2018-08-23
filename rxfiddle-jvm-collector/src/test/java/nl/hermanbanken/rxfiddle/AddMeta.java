package nl.hermanbanken.rxfiddle;

public class AddMeta implements Captured {
    private final long id;
    private final Object meta;

    public AddMeta(long id, Object meta) {
        this.id = id;
        this.meta = meta;
    }

    @Override
    public String toString() {
        return "(AddMeta) {" +
                "\"id\":\"" + id +
                "\",\"meta\":" + meta +
                "}";
    }
}