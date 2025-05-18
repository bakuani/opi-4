package ru.ani.web.services;

public interface AreaCalculatorMBean {
    void addPoint(double x, double y);
    double getArea();
    int getPointCount();
    void clearPoints();
}