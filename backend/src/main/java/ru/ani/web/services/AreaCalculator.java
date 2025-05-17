package ru.ani.web.services;

import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;
import ru.ani.web.interfaces.AreaCalculatorMBean;

@ManagedResource(objectName = "ru.ani.web:type=AreaCalculator")
@Component
public class AreaCalculator implements AreaCalculatorMBean {
    @Override
    public double calculateArea(double r) {
        // Формула площади на основе условий из CheckPoint.isPointInArea()
        double rectangleArea = r * r;                          // Квадрат в первой четверти
        double circleArea = Math.PI * r * r / 4;               // Круг в четвёртой четверти
        double triangleArea = 0.5 * r * (r / 2);               // Треугольник во второй четверти
        return rectangleArea + circleArea + triangleArea;
    }
}