package ru.ani.web.services;

public interface PointCounterMBean {
    int getTotalPoints();
    int getInvalidPoints();
    int getNotInAreaPoints();
}