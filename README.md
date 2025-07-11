# Go Monitoring Demo

A Go web server with Prometheus and Grafana monitoring, tracking HTTP request metrics (count, latency, status) and system resources (CPU, memory, disk, network). Uses Docker Compose for deployment and Node Exporter for system metrics.

## Features

- Go HTTP server serving static files.
- Prometheus metrics for HTTP requests and system resources.
- Grafana dashboards for visualizing metrics.
- Deployed via Docker Compose.

## Prerequisites

- Go 1.24+
- Docker and Docker Compose

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/go-monitoring-demo.git
   cd go-monitoring-demo
   ```
