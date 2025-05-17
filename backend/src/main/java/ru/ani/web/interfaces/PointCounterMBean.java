package ru.ani.web.interfaces;

public interface PointCounterMBean {
    int getTotalPoints();      // Общее количество точек
    int getInvalidPoints();    // Точки с координатами вне области
    void sendNotification();   // Отправка уведомления
}