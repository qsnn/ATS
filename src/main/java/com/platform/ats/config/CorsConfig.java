package  com.platform.ats.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 设置允许的源 - 根据您的前端地址调整
        config.addAllowedOrigin("http://localhost:63342");
        config.addAllowedOrigin("http://127.0.0.1:63342");
        config.addAllowedOrigin("http://124.71.101.139:10085");
        config.addAllowedOrigin("http://ats.qsnn.cloud");

        // 允许所有头
        config.addAllowedHeader("*");

        // 允许所有方法
        config.addAllowedMethod("*");

        // 允许凭证
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}