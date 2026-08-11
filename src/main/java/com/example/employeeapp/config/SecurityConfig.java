package com.example.employeeapp.config;

import com.example.employeeapp.service.EmployeeUserDetailsService;
import com.example.employeeapp.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration wiring together the custom
 * {@link EmployeeUserDetailsService}, a {@link PasswordEncoder}, the
 * {@link AuthenticationManager} used to authenticate login requests, the
 * {@link JwtAuthenticationFilter} used to authenticate subsequent requests
 * bearing a JWT, and REST-friendly {@link RestAuthenticationEntryPoint} /
 * {@link RestAccessDeniedHandler} for 401/403 responses.
 *
 * {@code /api/auth/**} is open to unauthenticated requests; everything else
 * requires authentication.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final EmployeeUserDetailsService employeeUserDetailsService;
    private final JwtService jwtService;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final RestAccessDeniedHandler restAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(employeeUserDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/employees/*/leaves")
                                .hasAnyRole("EMPLOYEE", "HR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/employees/*/leaves")
                                .hasAnyRole("EMPLOYEE", "HR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/employees/**").hasAnyRole("HR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/employees/**").hasAnyRole("HR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/employees/**").hasAnyRole("HR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/employees/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/manager/leaves").hasAnyRole("HR", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/manager/leaves/**").hasAnyRole("HR", "ADMIN")
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(restAuthenticationEntryPoint)
                        .accessDeniedHandler(restAccessDeniedHandler))
                .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
