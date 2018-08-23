package nl.hermanbanken.rxfiddle.js.oct;

public class ObservableTree implements IObservableTree {
    private final long id;
    private final ITreeLogger logger;

    public ObservableTree(long id, ITreeLogger logger, String name) {
        this.id = id;
        this.logger = logger;

        logger.addNode(id, "observable");
        logger.addMeta(id, new MetaWithNames(name));
    }

    public void addMeta(Object meta) {
        logger.addMeta(id, meta);
    }
}