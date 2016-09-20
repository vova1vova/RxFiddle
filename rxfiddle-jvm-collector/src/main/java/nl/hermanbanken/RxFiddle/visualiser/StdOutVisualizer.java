package nl.hermanbanken.rxfiddle.visualiser;

import nl.hermanbanken.rxfiddle.*;
import nl.hermanbanken.rxfiddle.data.Invoke;
import nl.hermanbanken.rxfiddle.data.InvokeResult;
import nl.hermanbanken.rxfiddle.data.Label;

public class StdOutVisualizer implements Visualizer {

  @Override
  public void logRun(Object identifier) {
    System.out.println("fiddle run " + identifier);
  }

  @Override
  public void logInvoke(Invoke invoke) {
    System.out.println("fiddle setup " + toString(invoke));
  }

  @Override
  public void logResult(InvokeResult result) {
    System.out.println("fiddle setup " + toString(result));
  }

  private static String toString(Label label) {
    return String.format(
        "%s.%s:%d", label.className.replace('/', '.'), label.methodName, label.lineNumber);
  }

  private static String toString(Invoke invoke) {
    return invoke.target == null
        ? String.format(
            "static[%s::%s], %s",
            invoke.className.replace('/', '.'),
            invoke.methodName,
            toString(invoke.label))
        : String.format(
            "%s[%s::%s], %s",
            objectToString(invoke.target),
            invoke.className.replace('/', '.'),
            invoke.methodName,
            toString(invoke.label));
  }

  private static String toString(InvokeResult ir) {
    return String.format("%s => %s", toString(ir.invoke), objectToString(ir.result));
  }

  private static String objectToString(Object object) {
    return String.format(
        "(%s %s)", object.getClass().getName(), Integer.toHexString(object.hashCode()));
  }

  static {
    new Thread(
            () -> {
              try {
                Thread.sleep(4000);
              } catch (InterruptedException e) {
                e.printStackTrace();
              }

              System.err.println(Hook.results);
            })
        .start();
  }
}
