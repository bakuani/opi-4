package ru.ani.web.services;

import javax.management.Notification;
import javax.management.NotificationBroadcasterSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;
import ru.ani.web.models.Point;

@Component
@ManagedResource(objectName = "ru.ani.web.services:type=PointCounter", description = "Count different types of points")
public class PointCounter extends NotificationBroadcasterSupport implements PointCounterMBean {

    private final CheckPoint pointChecker;

    private int totalPoints = 0;
    private int invalidPoints = 0;
    private int notInAreaPoints = 0;
    private long sequenceNumber = 1;

    @Autowired
    public PointCounter(CheckPoint pointChecker) {
        this.pointChecker = pointChecker;
    }

    @Override
    public synchronized int getTotalPoints() {
        return totalPoints;
    }

    @Override
    public synchronized int getInvalidPoints() {
        return invalidPoints;
    }

    @Override
    public synchronized int getNotInAreaPoints() {
        return notInAreaPoints;
    }

    public synchronized void incrementCounters(Point point) {
        totalPoints++;

        if (isOutOfDisplayArea(point)) {
            invalidPoints++;

            Notification n = new Notification(
                    "PointOutOfBounds",
                    this,
                    sequenceNumber++,
                    System.currentTimeMillis(),
                    "Точка (" + point.getX() + ", " + point.getY() + ") вне области"
            );
            sendNotification(n);
        } else if (!pointChecker.isPointInArea(point.getX(), point.getY(), point.getR())) {
            notInAreaPoints++;
        }
    }

    private synchronized boolean isOutOfDisplayArea(Point point) {
        return point.getX() < -5 || point.getX() > 5 || point.getY() < -5 || point.getY() > 5;
    }
}