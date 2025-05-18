package ru.ani.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.ani.web.services.PointCounter;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import java.lang.management.ManagementFactory;

@Configuration
public class JmxConfiguration {

//    @Bean
//    public PointCounter pointCounter() {
//        PointCounter counter = new PointCounter();
//        try {
//            MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
//            ObjectName name = new ObjectName("ru.ani.web:type=PointCounter");
//            mbs.registerMBean(counter, name);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return counter;
//    }
}
