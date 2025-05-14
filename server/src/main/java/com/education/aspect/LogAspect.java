package com.education.aspect;

import com.education.entity.SystemLog;
import com.education.service.SystemLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.time.LocalDateTime;

@Aspect
@Component
public class LogAspect {
    
    @Autowired
    private SystemLogService systemLogService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Pointcut("@annotation(com.education.annotation.Log)")
    public void logPointcut() {}
    
    @Around("logPointcut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long beginTime = System.currentTimeMillis();
        
        // 执行方法
        Object result = point.proceed();
        
        // 执行时长(毫秒)
        long time = System.currentTimeMillis() - beginTime;
        
        // 保存日志
        saveLog(point, time, result);
        
        return result;
    }
    
    private void saveLog(ProceedingJoinPoint joinPoint, long time, Object result) throws Exception {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        SystemLog log = new SystemLog();
        
        // 设置日志类型
        log.setType("OPERATION");
        
        // 设置操作用户
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            log.setUsername(authentication.getName());
        }
        
        // 设置请求方法
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = method.getName();
        log.setAction(className + "." + methodName + "()");
        
        // 设置请求参数
        Object[] args = joinPoint.getArgs();
        try {
            String params = objectMapper.writeValueAsString(args);
            log.setParams(params);
        } catch (Exception e) {
            log.setParams("参数序列化失败");
        }
        
        // 设置返回结果
        try {
            String resultJson = objectMapper.writeValueAsString(result);
            log.setResult(resultJson);
        } catch (Exception e) {
            log.setResult("结果序列化失败");
        }
        
        // 设置请求信息
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            log.setIp(getIpAddress(request));
            log.setUserAgent(request.getHeader("User-Agent"));
        }
        
        // 设置创建时间
        log.setCreatedAt(LocalDateTime.now());
        
        // 保存日志
        systemLogService.saveLog(log);
    }
    
    private String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
} 