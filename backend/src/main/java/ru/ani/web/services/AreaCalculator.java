package ru.ani.web.services;

import org.springframework.stereotype.Component;

@Component
public class AreaCalculator implements AreaCalculatorMBean {

    @Override
    public double calculateArea(double r) {
        double rectangleArea = r * r;
        double circleArea = Math.PI * r * r / 4;
        double triangleArea = 0.5 * r * (r / 2);
        return rectangleArea + circleArea + triangleArea;
    }
}