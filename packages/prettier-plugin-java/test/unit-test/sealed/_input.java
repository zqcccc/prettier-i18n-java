public sealed class Rectangle
    implements Shape
    permits Square {

    private final double length;
    private final double height;

    public Rectangle(double length, double height) {
        this.length = length;
        this.height = height;
    }

    @Override
    public double area() {
        return length * height;
    }

}

public non-sealed class RightTriangle implements Triangle {

    private final double adjacent;
    private final double opposite;

    public RightTriangle(double adjacent, double opposite) {
        this.adjacent = adjacent;
        this.opposite = opposite;
    }

    @Override
    public double area() {
        interface People { String name(); }
        record Person(String name) implements People { }
        record Persons(String... names) { }

        People p = new Person("John Doe");

        return adjacent * opposite / 2;
    }

}

public sealed interface Shape
    permits Circle, Rectangle, Triangle, Unicorn {

    double area();

    default Shape rotate(double angle) {
        return this;
    }

    default String areaMessage() {
        if (this instanceof Circle)
            return "Circle: " + area();
        else if (this instanceof Rectangle)
            return "Rectangle: " + area();
        else if (this instanceof RightTriangle)
            return "Triangle: " + area();
        // :(
        throw new IllegalArgumentException();
    }

}

public non-sealed interface Triangle extends Shape {

}

public sealed interface Shape permits ALongVeryLongCircle, ALongVeryLongRectangle, ALongVeryLongTriangle, ALongVeryLongUnicorn {}
public sealed interface Shape extends AbstractShape permits ALongVeryLongCircle, ALongVeryLongRectangle, ALongVeryLongTriangle, ALongVeryLongUnicorn {}
public sealed class Shape permits ALongVeryLongCircle, ALongVeryLongRectangle, ALongVeryLongTriangle, ALongVeryLongUnicorn {}
public sealed class Shape extends AbstractShape permits ALongVeryLongCircle, ALongVeryLongRectangle, ALongVeryLongTriangle, ALongVeryLongUnicorn {}

public class NestedSealedClasses {
    public static sealed abstract class SealedParent permits SealedChild {}

    final static class SealedChild extends SealedParent {}
}

public class NestedNonSealedClasses {
    public static non-sealed abstract class NonSealedParent {}

    final static class SealedChild extends NonSealedParent {}
}

public interface Test {
    sealed interface Inner {}

    public static sealed abstract class SealedParent {}

    non-sealed interface Inner {}

    public static non-sealed abstract class SealedParent {}

    final static class SealedChild extends SealedParent {}
}
