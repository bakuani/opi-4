FROM openjdk:17-jdk-slim

WORKDIR /opt/project

COPY ./backend ./

EXPOSE 3210
EXPOSE 9010

CMD ["sh", "-c", "java \
    -Dcom.sun.management.jmxremote \
    -Dcom.sun.management.jmxremote.port=9010 \
    -Dcom.sun.management.jmxremote.rmi.port=9010 \
    -Dcom.sun.management.jmxremote.ssl=false \
    -Dcom.sun.management.jmxremote.authenticate=false \
    -Djava.rmi.server.hostname=127.0.0.1 \
    -jar /opt/project/target/web-0.0.1-SNAPSHOT.jar"]