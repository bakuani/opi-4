package ru.ani.web.services;

import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static java.lang.Math.atan2;
import static java.lang.Math.hypot;

@Component
@ManagedResource(objectName = "ru.ani.web.services:type=AreaCalculator", description = "Calculates polygon area based on added points")
public class AreaCalculator implements AreaCalculatorMBean {

    private final List<Point> points = new ArrayList<>();

    @Override
    @ManagedOperation(description = "Add a point to the polygon")
    public synchronized void addPoint(double x, double y) {
        points.add(new Point(x, y));
    }

    @Override
    @ManagedAttribute(description = "Current polygon area")
    public synchronized double getArea() {
        int n = points.size();
        if (n < 3) {
            return 0.0;
        }

        double cx = points.stream().mapToDouble(p -> p.x).average().orElse(0);
        double cy = points.stream().mapToDouble(p -> p.y).average().orElse(0);

        points.sort(Comparator
                .comparingDouble((Point p) -> atan2(p.y - cy, p.x - cx))
                .thenComparingDouble(p -> hypot(p.x - cx, p.y - cy))
        );

        double acc = 0.0;
        for (int i = 0; i < n; i++) {
            Point p1 = points.get(i);
            Point p2 = points.get((i + 1) % n);
            acc += p1.x * p2.y - p2.x * p1.y;
        }
        return Math.abs(acc / 2.0);
    }

    @Override
    @ManagedAttribute(description = "Number of added points")
    public synchronized int getPointCount() {
        return points.size();
    }

    @Override
    @ManagedOperation(description = "Clear all points")
    public synchronized void clearPoints() {
        points.clear();
    }

    private record Point(double x, double y) {
    }
}