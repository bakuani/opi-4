FROM openjdk:17-jdk-slim

WORKDIR /opt/project

COPY ./backend ./

EXPOSE 3210

CMD ["java", "-jar", "/opt/project/target/web-0.0.1-SNAPSHOT.jar"]