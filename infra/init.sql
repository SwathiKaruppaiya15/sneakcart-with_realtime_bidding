-- Runs automatically when PostgreSQL Docker container starts for the first time

-- Single database for sneakcart-backend (monolith)
CREATE DATABASE sneakcart;

-- Separate databases for microservices (if used instead)
CREATE DATABASE sneakcart_auth;
CREATE DATABASE sneakcart_products;
CREATE DATABASE sneakcart_orders;
CREATE DATABASE sneakcart_bids;
