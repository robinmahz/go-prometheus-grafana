package main

import (
    "fmt"
    "log"
    "net/http"
    "time"

    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

// Define Prometheus metrics
var (
    // Counter for total HTTP requests
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"path", "method", "status"},
    )

    // Histogram for request duration
    httpRequestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "Duration of HTTP requests in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"path", "method"},
    )
)

// Middleware to log incoming requests and track Prometheus metrics
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        path := r.URL.Path
        method := r.Method

        // Log request details
        log.Printf("Received %s request for %s from %s", method, path, r.RemoteAddr)

        // Wrap ResponseWriter to capture status code
        rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
        next.ServeHTTP(rw, r)

        // Record metrics
        duration := time.Since(start).Seconds()
        httpRequestsTotal.WithLabelValues(path, method, fmt.Sprintf("%d", rw.statusCode)).Inc()
        httpRequestDuration.WithLabelValues(path, method).Observe(duration)
    })
}

// responseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
    http.ResponseWriter
    statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
    rw.statusCode = code
    rw.ResponseWriter.WriteHeader(code)
}

func main() {
    // Register Prometheus metrics
    prometheus.MustRegister(httpRequestsTotal)
    prometheus.MustRegister(httpRequestDuration)

    // Create a new ServeMux to handle routes
    mux := http.NewServeMux()

    // Set up file server and handlers
    fileServer := http.FileServer(http.Dir("./static"))
    mux.Handle("/", fileServer)

    // Expose Prometheus metrics endpoint
    mux.Handle("/metrics", promhttp.Handler())

    // Wrap the entire mux with the logging middleware
    fmt.Println("Starting server on port 8000...")
    if err := http.ListenAndServe(":8000", loggingMiddleware(mux)); err != nil {
        log.Fatal(err)
    }
}